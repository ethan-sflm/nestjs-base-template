import { Test, TestingModule } from '@nestjs/testing';
import RedisModule from '../../redis.module';
import { RedisService } from '../redis.service';

describe('Redis service', () => {
  let module: TestingModule;
  let service: RedisService;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [RedisModule],
    }).compile();
    service = module.get(RedisService);
    await service.flush();
  });

  afterAll(async () => {
    jest.clearAllMocks();
    await module.close();
  });

  afterEach(async () => {
    await service.flush();
  });

  it('redis service, set', async () => {
    expect(await service.set('test_key', 'test_value')).toBe('OK');
  });

  it('redis service, get', async () => {
    await service.set('test_key', 'test_value');
    expect(await service.get('test_key')).toBe('test_value');
  });
});
