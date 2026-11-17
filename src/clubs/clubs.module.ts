import { Module } from '@nestjs/common';
import { ClubsService } from './clubs.service.js';
import { ClubsController } from './clubs.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Club } from './entities/club.entity.js';
import { User } from '../users/entites/user.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Club,User])],
  controllers: [ClubsController],
  providers: [ClubsService],
})
export class ClubsModule {}
