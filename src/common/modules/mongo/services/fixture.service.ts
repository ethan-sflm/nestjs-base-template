import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { typeWrapper } from '../../../utils';
import { Fixture, FixtureInput } from '../types';

@Injectable()
export class FixtureService {
  private fixtures: Fixture[];
  constructor(
    @InjectConnection() private connection: Connection,
    private configService: ConfigService,
  ) {
    this.fixtures = require(this.configService.get<string>(
      'fixture.dir',
    )).default;
  }
  /**
   * ```ts
   *  // load a specific
   *  loadFixtures('users')
   *
   *  // load array
   *  loadFixture(['users', 'roles'])
   *  // or
   *  loadFixture([{collectionName: 'users'}])
   * ```
   * @param inputs a specific FixtureInput or FixtureInput array, which can be found in existing fixtures
   */
  async loadFixtures(inputs?: FixtureInput | FixtureInput[]) {
    const _fixtures = inputs
      ? [].concat(inputs).map(input => {
          const _fixture = this.fixtures.find(
            x => x.collectionName === (input.collectionName || input),
          );

          if (_fixture) {
            return {
              collectionName: _fixture.collectionName,
              data: _fixture[input.source || 'defaults'] || [],
            };
          }
        })
      : this.fixtures.map(x => {
          return { ...x, data: x.defaults };
        });
    return Promise.all(
      _fixtures.map(fixture => {
        const { collectionName, data } = fixture;
        return this.connection
          .collection(collectionName)
          .insertMany(typeWrapper(data));
      }),
    );
  }

  /**
   * ```ts
   *
   * // clear a specific
   * await clear('name1')
   *
   * // or []
   * await clear(['name1', 'name2'])
   *
   * // if agvs is null, clear all
   * await clear()
   *
   * ```
   * @param collectionNames Collection's name[s] which needs to be clearing
   */
  async clear(collectionNames?: string | string[]) {
    const defaults = (await this.connection.db.collections()).map(
      x => x.collectionName,
    );
    const _collectionNames = collectionNames
      ? [].concat(collectionNames).filter(x => defaults.includes(x))
      : defaults;
    return Promise.all(
      _collectionNames.map(collectionName =>
        this.connection.collection(collectionName).deleteMany({}),
      ),
    );
  }

  /**
   * Load custom data, differ from initial
   * ```ts
   * service.loadCustom([{ collectionName:'users', data:[{id:1}] }])
   * ```
   * @param inputs
   */
  async loadCustom(inputs: { collectionName: string; data: any[] }[]) {
    return Promise.all(
      inputs.map(input => {
        const { collectionName, data } = input;
        return this.connection
          .collection(collectionName)
          .insertMany(typeWrapper(data));
      }),
    );
  }
}
