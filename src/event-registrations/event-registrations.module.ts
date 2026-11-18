import { Module } from '@nestjs/common';
import { EventRegistrationsService } from './event-registrations.service.js';
import { EventRegistrationsController } from './event-registrations.controller.js';

@Module({
  controllers: [EventRegistrationsController],
  providers: [EventRegistrationsService],
})
export class EventRegistrationsModule {}
