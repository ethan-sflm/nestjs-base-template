import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';

describe('App Module', () => {
  let module: TestingModule;
  let configService: ConfigService;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule.forRoot()],
    }).compile();
    configService = module.get(ConfigService);
  });

  afterAll(async () => {
    await module.close();
  });

  describe('ConfigService initialize successful', () => {
    it('load data', () => {
      const mysqlHost = configService.get('mysql.host');
      expect(mysqlHost).toBe('127.0.0.1');
    });
  });
});
