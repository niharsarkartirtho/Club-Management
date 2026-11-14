
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnnouncementsController } from './announcements.controller.js';
import { AnnouncementsService } from './announcements.service.js';
import { Announcement } from './entities/announcement.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Announcement])],
  controllers: [AnnouncementsController],
  providers: [AnnouncementsService],
  exports: [AnnouncementsService],
})
export class AnnouncementsModule { }
