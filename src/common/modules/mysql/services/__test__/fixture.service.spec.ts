import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '../../../../../config';
import { FixtureService } from '../fixture.service';
import { TypeOrmModule as NestTypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { Connection } from 'typeorm';

@Entity('roles')
class Role {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;
}

@Entity('users')
class User {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;
}

jest.mock('../../../../../fixtures', () => {
  return {
    default: [
      {
        entityName: 'users',
        defaults: [
          {
            id: 1,
            name: 'user1',
          },
        ],
        anotherDataSource: [
          {
            id: 2,
            name: 'user2',
          },
        ],
      },
      {
        entityName: 'roles',
        defaults: [
          {
            id: 1,
            name: 'role1',
          },
        ],
        anotherDataSource: [
          {
            id: 2,
            name: 'role2',
          },
        ],
      },
    ],
  };
});

describe('Mysql fixture service', () => {
  let module: TestingModule;
  let service: FixtureService;
  let connection: Connection;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule,
        NestTypeOrmModule.forRootAsync({
          useFactory: (configService: ConfigService) => ({
            ...configService.get('mysql'),
            entities: [User, Role],
            synchronize: true,
          }),
          inject: [ConfigService],
        }),
        NestTypeOrmModule.forFeature([User, Role]),
      ],
      providers: [FixtureService, ConfigService],
      exports: [FixtureService],
    }).compile();
    service = module.get(FixtureService);
    connection = module.get(Connection);
    await service.clear();
  });

  afterAll(async () => {
    jest.clearAllMocks();
    await module.close();
  });

  afterEach(async () => {
    await service.clear();
  });

  it('load fixtures with default data source,  parameter type is null', async () => {
    await service.loadFixture();
    const result = await connection.getRepository('users').find({});
    await expect(result).toEqual([{ id: 1, name: 'user1' }]);
  });

  it('load fixtures with default data source,  parameter type is string', async () => {
    await service.loadFixture('users');
    const result = await connection.getRepository('users').find({});
    expect(result).toEqual([{ id: 1, name: 'user1' }]);
  });

  it('load fixtures with default data source,  parameter type is string[]', async () => {
    await service.loadFixture(['users', 'roles']);
    const users = await connection.getRepository('users').find({});
    expect(users).toEqual([{ id: 1, name: 'user1' }]);
    const roles = await connection.getRepository('roles').find({});
    expect(roles).toEqual([{ id: 1, name: 'role1' }]);
  });

  it('load fixtures with another data source,  parameter type is FixtureInput', async () => {
    await service.loadFixture({
      entityName: 'users',
      source: 'anotherDataSource',
    });
    const roles = await connection.getRepository('users').find({});
    expect(roles).toEqual([{ id: 2, name: 'user2' }]);
  });

  it('load fixtures with another data source,  parameter type is FixtureInput[]', async () => {
    await service.loadFixture([
      {
        entityName: 'users',
        source: 'anotherDataSource',
      },
      {
        entityName: 'roles',
        source: 'anotherDataSource',
      },
    ]);
    const users = await connection.getRepository('users').find({});
    expect(users).toEqual([{ id: 2, name: 'user2' }]);
    const roles = await connection.getRepository('roles').find({});
    expect(roles).toEqual([{ id: 2, name: 'role2' }]);
  });

  it('load with custom data', async () => {
    await service.loadCustom([
      {
        entityName: 'users',
        data: [{ id: 3, name: 'user3' }],
      },
      {
        entityName: 'roles',
        data: [{ id: 3, name: 'role3' }],
      },
    ]);
    const users = await connection.getRepository('users').find({});
    expect(users).toEqual([{ id: 3, name: 'user3' }]);
    const roles = await connection.getRepository('roles').find({});
    expect(roles).toEqual([{ id: 3, name: 'role3' }]);
  });

  it('clear fixtures', async () => {
    await service.loadFixture([
      {
        entityName: 'users',
        source: 'anotherDataSource',
      },
      {
        entityName: 'roles',
        source: 'anotherDataSource',
      },
    ]);
    await service.clear('users');
    const _users = await connection.getRepository('users').find({});
    expect(_users).toEqual([]);
    const _roles = await connection.getRepository('roles').find({});
    expect(_roles).toEqual([{ id: 2, name: 'role2' }]);
  });
});
