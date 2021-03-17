import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { AlternativeRest } from '../alternativeRest';
import { InjectModel, MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoModule } from '../../mongo.module';
import { User, UserSchema } from './__mock__/alternativeRest.mock';
import { Document } from 'mongoose';
import { FixtureService } from '../../services';

@Injectable()
class MockService extends AlternativeRest<User & Document> {
  constructor(@InjectModel(User.name) model: Model<User & Document>) {
    super(model);
  }
}

describe('AlternativeRest', () => {
  let module: TestingModule;
  let service: MockService;
  let fixtureHelper: FixtureService;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        MongoModule,
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
      ],
      providers: [MockService],
    }).compile();
    service = module.get(MockService);
    fixtureHelper = module.get(FixtureService);

    await fixtureHelper.clear();
  });

  afterAll(async () => {
    await fixtureHelper.clear();
    await module.close();
  });

  it('insertMany', async () => {
    const res = await service.insertMany([new User('1'), new User('2')]);
    expect(res.length).toBe(2);
  });

  it('list', async () => {
    const res = await service.list({ filters: {} });
    expect(res.length).toBe(2);
  });

  it('find', async () => {
    const res = await service.find({ id: '1' });
    expect(res[0].id).toBe('1');
  });

  it('findOneAndUpdate', async () => {
    const res = await service.findOneAndUpdate(
      { id: '1' },
      { name: 'name-2' },
      { new: true, upsert: true },
    );
    expect(res.name).toBe('name-2');
  });

  it('delete', async () => {
    const res = await service.delete({ id: '1' });
    expect(res.deletedCount).toBe(1);
  });
});
