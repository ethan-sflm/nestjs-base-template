import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
class User {
  @Prop({})
  id: string;

  @Prop({})
  name?: string;

  constructor(id: string, name = 'unknown') {
    this.id = id;
    this.name = name;
  }
}

const UserSchema = SchemaFactory.createForClass(User);

export { User, UserSchema };
