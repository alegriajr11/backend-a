import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

const parseBooleanConfig = (value: string | undefined, defaultValue = false): boolean => {
  if (value === undefined) {
    return defaultValue;
  }

  return value.toLowerCase() === 'true' || value === '1';
};

export const getDatabaseConfig = (configService: ConfigService) => ({
  type: 'mysql' as const,
  host: configService.getOrThrow<string>('DB_HOST'),
  port: Number(configService.getOrThrow<string>('DB_PORT')),
  username: configService.getOrThrow<string>('DB_USERNAME'),
  password: configService.getOrThrow<string>('DB_PASSWORD'),
  database: configService.getOrThrow<string>('DB_NAME'),
  autoLoadEntities: true,
  synchronize: parseBooleanConfig(configService.get<string>('DB_SYNCHRONIZE')),
  logging: parseBooleanConfig(configService.get<string>('DB_LOGGING')),
});

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => getDatabaseConfig(configService),
    }),
  ],
})
export class DatabaseModule {}
