import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Venue } from './entites/venue.entity.js'; 
import { Repository } from 'typeorm';
import { CreateVenueDto } from './dto/create-venue.dto.js';
import { UpdateVenueDto } from './dto/update-venue.dto.js';
import { Event, EventStatus } from '../events/entities/event.entity.js';

@Injectable()
export class VenuesService {
    constructor(
    @InjectRepository(Venue) private readonly venueRepo: Repository<Venue>,
    @InjectRepository(Event) private readonly eventRepo: Repository<Event>,
  ) {}


  async create(body: CreateVenueDto) {
    const existingVenue = await this.venueRepo.findOne({ 
        where: { name: body.name } 
    });

    if (existingVenue) {
      throw new ConflictException('venue name already used');
    }

    const venue = this.venueRepo.create({
      name: body.name,
      location: body.location,
      capacity: body.capacity,
    });
    const saved = await this.venueRepo.save(venue);

    return { 
        message: 'venue created', venue: saved 
    };
  }

  async findAll() {
    return await this.venueRepo.find({
         order: { name: 'ASC' } 
    });
  } 

 
  async findOne(id: number) {
    const venue = await this.venueRepo.findOne({ where: { id } });
    if (!venue) {
      throw new NotFoundException('venue not found');
    }
    return venue;
  }

  
  async availability(id: number, date: string) {
    const venue = await this.findOne(id);

    
    const dayStart = new Date(date.substring(0, 10) + 'T00:00:00');
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);

    const events = await this.eventRepo
      .createQueryBuilder('e')
      .where('e.venue_id = :id', { id })
      .andWhere('e.status != :cancelled', { cancelled: EventStatus.CANCELLED })
      .andWhere('e.start_time < :dayEnd AND e.end_time > :dayStart', { dayStart, dayEnd })
      .orderBy('e.start_time', 'ASC')
      .getMany();

    const bookedSlots = [];
    for (const event of events) {
      bookedSlots.push({
        eventId: event.id,
        title: event.title,
        startTime: event.startTime,
        endTime: event.endTime,
      });
    }

    return {
      venue: venue.name,
      date: date.substring(0, 10),
      bookedSlots: bookedSlots,
    };
  }

  async update(id: number, body: UpdateVenueDto) {
    const venue = await this.findOne(id);

    if (body.name && body.name !== venue.name) {
      const nameUsed = await this.venueRepo.findOne({
         where: { name: body.name } 
        });

      if (nameUsed) {
        throw new ConflictException('venue name already used');
      }
    }

    if (body.name) venue.name = body.name;
    if (body.location) venue.location = body.location;
    if (body.capacity) venue.capacity = body.capacity;

    return this.venueRepo.save(venue);
  }

  async remove(id: number) {
    const venue = await this.findOne(id);

    const eventCount = await this.eventRepo.count({
         where: { venue: { id } } 
        });
        
    if (eventCount > 0) {
      throw new ConflictException('venue is used by events, can not delete');
    }

    await this.venueRepo.remove(venue);
    return { message: 'venue deleted' };
  }
}


