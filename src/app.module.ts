import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UsersModule } from './users/users.module.js';
import { AuthModule } from './auth/auth.module.js';
import { ConfigModule, ConfigService, } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembershipsModule } from './memberships/memberships.module.js';
import { AttendanceModule } from './attendance/attendance.module.js';
@Module({
  imports: [UsersModule, AuthModule, AttendanceModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASS'),
        database: config.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    MembershipsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }