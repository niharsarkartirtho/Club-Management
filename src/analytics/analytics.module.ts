
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AnalyticsController } from './analytics.controller.js';
import { AnalyticsService } from './analytics.service.js';

import { Event } from '../events/entities/event.entity.js';
import { Registration } from '../event-registrations/entities/event-registration.entity.js';
import { Attendance } from '../attendance/entities/attendance.entity.js';
import { Club } from '../clubs/entities/club.entity.js';
import { User } from '../users/entites/user.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Event,
      Registration,
      Attendance,
      Club,
      User,
    ]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule { }
