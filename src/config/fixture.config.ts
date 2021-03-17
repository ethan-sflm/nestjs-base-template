import { registerAs } from '@nestjs/config';
import * as path from 'path';

export default registerAs('fixture', () => ({
  dir: path.join(__dirname, '../fixtures'),
}));
