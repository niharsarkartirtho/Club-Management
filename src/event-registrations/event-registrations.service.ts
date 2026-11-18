
import { AuthUser } from '../auth/jwt-auth/jwt-auth.guard.js';
import { MembershipsService } from '../memberships/memberships.service.js';
import { EventsService } from '../events/events.service.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Registration } from './entities/event-registration.entity.js';
import { ConflictException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class EventRegistrationsService {
  constructor(
    @InjectRepository(Registration) private readonly registrationRepo: Repository<Registration>,
    private readonly eventsService: EventsService,

  ) {}




  async registerEvent(user: AuthUser, eventId: number) {
    await this.eventsService.findOne(eventId);

    const existing = await this.registrationRepo.findOne({
      where: {
        user: { id: user.sub },
        event: { id: eventId },
      },
    });

    if (existing && existing.status !== 'CANCELLED') {
      throw new ConflictException('Already registered for this event');
    }

    const registration = this.registrationRepo.create({
      user: { id: user.sub },
      event: { id: eventId },
      status: 'REGISTERED',
    });

    await this.registrationRepo.save(registration);

    return { message: 'Successfully registered' };
  }


  myRegistrations(userId: number) {
    return this.registrationRepo.find({
      where: { user: { id: userId } },
      relations: { event: true },
      order: { registeredAt: 'DESC' },
    });
  }


}
