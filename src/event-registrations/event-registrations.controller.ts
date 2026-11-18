import { Controller } from '@nestjs/common';
import { EventRegistrationsService } from './event-registrations.service.js';

@Controller('event-registrations')
export class EventRegistrationsController {
  constructor(private readonly eventRegistrationsService: EventRegistrationsService) {}
}
