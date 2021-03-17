import { Injectable } from '@nestjs/common';
import {
  Document,
  Model,
  FilterQuery,
  UpdateQuery,
  QueryOptions,
} from 'mongoose';

/**
 *
 * Encapsulate some simple, generic CURD handles for RESTful apis
 * Prepare for Business service to extending
 *
 * ```ts
 * @Injectable()
 * class UserService extends AlternativeRest{
 *    constructor(@InjectModel(User.name) model: Model<User>) {
 *        super(this.model);
 *    }
 * }
 *
 * @Injectable()
 * class UserController {
 *    constructor(private readonly userService: UserService) {}
 *
 *    @Get()
 *    list = ()=> this.userService.list()
 * }
 *
 * ```
 */
@Injectable()
export class AlternativeRest<T extends Document> {
  private readonly model: Model<T>;
  constructor(model: Model<T>) {
    this.model = model;
  }

  list(options: {
    limit?: number;
    from?: number;
    sort?: { [x: string]: 1 | -1 };
    filters: FilterQuery<T>;
  }) {
    const { limit = 100, from = 0, filters, sort } = options;
    return this.model
      .find(filters)
      .skip(from)
      .limit(limit)
      .sort(sort);
  }

  find(filters: FilterQuery<T>) {
    return this.model.find(filters);
  }

  insertMany(docs: any[]) {
    const _docs = [].concat(docs);
    return this.model.insertMany(_docs);
  }

  findOneAndUpdate(
    filter?: FilterQuery<T>,
    update?: UpdateQuery<T>,
    options?: QueryOptions | null,
  ) {
    return this.model.findOneAndUpdate(filter, update, {
      ...options,
      useFindAndModify: false,
    });
  }

  delete(filter?: any, options?: QueryOptions) {
    return this.model.deleteMany(filter, options);
  }
}
