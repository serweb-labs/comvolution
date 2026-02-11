import * as dotenv from 'dotenv';

dotenv.config();

export class ConfigService {
  get(key: string, defaultValue?: string): string {
    const value = process.env[key];
    return value !== undefined ? value : defaultValue ?? '';
  }
}
