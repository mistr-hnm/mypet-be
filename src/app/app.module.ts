import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { RouterModule } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { routes } from '../routes';
import { validateEnv } from '../lib/env';
import { UserModule } from './users/user.module';
import { PermissionModule } from './permission/permission.module';
import { FileModule } from './file/file.module'; 
import { PetModule } from './pet/pet.module';
import { PetAdoptionModule } from './petadoption/petadoption.module';
import { AuthenticationMiddleware } from 'src/core/middleware/authentication.middleware';

@Module({
  imports: [
    RouterModule.register(routes),

    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validate: validateEnv, 
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('POSTGRES_HOST'),
        port: parseInt(config.get<string>('POSTGRES_PORT') || '5432'),
        username: config.get<string>('POSTGRES_USER'),
        password: config.get<string>('POSTGRES_PASSWORD'),
        database: config.get<string>('POSTGRES_DB'),
        autoLoadEntities: true,
        synchronize: true,
        ssl: { rejectUnauthorized: false },
        logging: true,
      }),
    }),

    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
    UserModule,
    PermissionModule,
    FileModule, 
    PetModule,
    PetAdoptionModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes("*")
  }
}
