import { registerAs } from '@nestjs/config';

export default registerAs('mongo', () => ({
  uri: process.env.MONGO_URI || 'mongodb://localhost/nestjs-base-template',
}));
