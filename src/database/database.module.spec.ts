import { ConfigService } from '@nestjs/config';
import { getDatabaseConfig } from './database.module';

describe('DatabaseModule config', () => {
  it('reads required database values with getOrThrow and parses boolean env flags', () => {
    const configService = {
      getOrThrow: jest.fn((key: string) => {
        const values: Record<string, string> = {
          DB_HOST: 'localhost',
          DB_PORT: '3306',
          DB_USERNAME: 'root',
          DB_PASSWORD: 'secret',
          DB_NAME: 'app',
        };

        return values[key];
      }),
      get: jest.fn((key: string) => {
        const values: Record<string, string> = {
          DB_SYNCHRONIZE: 'true',
          DB_LOGGING: 'false',
        };

        return values[key];
      }),
    } as unknown as ConfigService;

    const config = getDatabaseConfig(configService);

    expect(config.host).toBe('localhost');
    expect(config.port).toBe(3306);
    expect(config.username).toBe('root');
    expect(config.password).toBe('secret');
    expect(config.database).toBe('app');
    expect(config.synchronize).toBe(true);
    expect(config.logging).toBe(false);
  });
});
