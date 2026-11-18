
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EventRegistrationsService } from './event-registrations.service.js';
import { EventRegistrationsController } from './event-registrations.controller.js';
import { Registration } from './entities/event-registration.entity.js';
import { Event } from '../events/entities/event.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Registration, Event]),
  ],
  controllers: [EventRegistrationsController],
  providers: [EventRegistrationsService],
})
export class EventRegistrationsModule {}
