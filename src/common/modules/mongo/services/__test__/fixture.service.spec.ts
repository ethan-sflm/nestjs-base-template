import { Test, TestingModule } from '@nestjs/testing';
import { MongoModule } from '../../mongo.module';
import { FixtureService } from '../fixture.service';

jest.mock('../../../../../fixtures', () => {
  return {
    default: [
      {
        collectionName: 'users',
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
        collectionName: 'roles',
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

describe('Mongo fixture service', () => {
  let module: TestingModule;
  let service: FixtureService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [MongoModule],
    }).compile();
    service = module.get(FixtureService);
    await service.clear();
  });

  afterAll(async () => {
    jest.clearAllMocks();
    await module.close();
  });

  afterEach(async () => {
    await service.clear();
  });

  it('load fixtures, use default data source', async () => {
    const res = await service.loadFixtures(['users']);
    expect(res[0].result.ok).toBe(1);
    expect(res[0].ops[0].name).toBe('user1');
  });

  it('load fixtures, use specific data source', async () => {
    const res = await service.loadFixtures([
      { collectionName: 'users', source: 'anotherDataSource' },
    ]);
    expect(res[0].result.ok).toBe(1);
    expect(res[0].ops[0].name).toBe('user2');
  });

  it('load fixtures, use custom data', async () => {
    const res = await service.loadCustom([
      { collectionName: 'users', data: [{ id: 1, name: 'user1' }] },
    ]);
    expect(res[0].result.ok).toBe(1);
    expect(res[0].ops[0].name).toBe('user1');
  });

  it('clear fixtures', async () => {
    await service.loadFixtures();
    const res = await service.clear();
    const okCount = res.reduce((count, item) => (count += item.result.ok), 0);
    expect(okCount).toBe(2);
  });
});
