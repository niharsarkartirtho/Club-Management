import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UsersModule } from './users/users.module.js';
import { AuthModule } from './auth/auth.module.js';
import { ConfigModule, ConfigService, } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnnouncementsModule } from './announcements/announcements.module.js';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'avoy',
    database: 'Club-Management',
    autoLoadEntities: true,
    synchronize: true,
  }),
    AnnouncementsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
