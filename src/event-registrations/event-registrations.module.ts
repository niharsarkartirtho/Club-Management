
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EventRegistrationsService } from './event-registrations.service.js';
import { EventRegistrationsController } from './event-registrations.controller.js';
import { Registration } from './entities/event-registration.entity.js';
import { Event } from '../events/entities/event.entity.js';
import { EventsModule } from '../events/events.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Registration]),
    EventsModule, // এটা লাগবেই
  ],
  providers: [EventRegistrationsService],
  controllers: [EventRegistrationsController],
})
export class EventRegistrationsModule {}
