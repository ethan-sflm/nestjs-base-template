import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { typeWrapper } from '../../../utils';
import { Connection, Repository } from 'typeorm';
import { Fixture, FixtureInput } from '../types';

@Injectable()
export class FixtureService {
  private fixtures: Fixture[];
  private repositories: { [name: string]: Repository<any> };
  constructor(
    private configService: ConfigService,
    private connection: Connection,
  ) {
    this.repositories = this.connection.entityMetadatas
      .map(x => x.tableName)
      .reduce((map: { [x: string]: Repository<any> }, entityName) => {
        Object.assign(map, {
          [entityName]: this.connection.getRepository(entityName),
        });
        return map;
      }, {});
    this.fixtures = require(this.configService.get<string>(
      'fixture.dir',
    )).default;
  }

  /**
   * Disable foreign key check
   */
  private async disableForeignCheck() {
    await this.connection.query('SET FOREIGN_KEY_CHECKS = 0;');
  }

  /**
   * Re-enable foreign key check
   */
  private async enableForeignCheck() {
    await this.connection.query('SET FOREIGN_KEY_CHECKS = 1;');
  }

  /**
   * Load initial fixtures, If parameters is null, load all
   * ```ts
   * service.loadFixture('user')
   * // or
   * service.loadFixture(['users', 'roles'])
   * // or
   * service.loadFixture({ entityName: 'users',source: 'anotherDataSource',})
   * // or
   * service.loadFixture([{ entityName: 'users',source: 'anotherDataSource',}])
   *
   * ```
   * @param inputs
   */
  async loadFixture(inputs?: FixtureInput | FixtureInput[]) {
    await this.disableForeignCheck();
    const _fixtures = inputs
      ? [].concat(inputs).map(input => {
          const _fixture = this.fixtures.find(
            x => x.entityName === (input.entityName || input),
          );

          if (_fixture) {
            return {
              entityName: _fixture.entityName,
              data: _fixture[input.source || 'defaults'] || [],
            };
          }
        })
      : this.fixtures.map(x => {
          return { ...x, data: x.defaults };
        });
    await Promise.all(
      _fixtures.map(fixture => {
        const { entityName, data } = fixture;
        return this.repositories[entityName].insert(typeWrapper(data));
      }),
    );
    await this.enableForeignCheck();
  }

  /**
   * Remove specific fixtures by giving entityNames
   * ```ts
   * service.clear('users')
   * // or
   * service.clear(['users', 'roles'])
   * ```
   * @param entityNames
   */
  async clear(entityNames?: string | string[]) {
    await this.disableForeignCheck();
    const defaults = Object.keys(this.repositories);
    const _entityNames = entityNames
      ? [].concat(entityNames).filter(x => defaults.includes(x))
      : defaults;
    await Promise.all(
      _entityNames.map(entityName => this.repositories[entityName].delete({})),
    );
    await this.enableForeignCheck();
  }

  /**
   * Load custom data, differ from initial
   * ```ts
   * service.loadCustom([{ entityName:'users', data:[{id:1}] }])
   * ```
   * @param inputs
   */
  async loadCustom(inputs: { entityName: string; data: any[] }[]) {
    await this.disableForeignCheck();
    await Promise.all(
      inputs.map(input => {
        const { entityName, data } = input;
        return this.repositories[entityName].insert(typeWrapper(data));
      }),
    );
    await this.enableForeignCheck();
  }
}
