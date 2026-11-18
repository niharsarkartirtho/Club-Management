import { Module } from '@nestjs/common';
import { VenuesService } from './venues.service.js';
import { VenuesController } from './venues.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Venue } from './entites/venue.entity.js';
import { Event } from '../events/entities/event.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Venue, Event])],
  controllers: [VenuesController],
  providers: [VenuesService],
})
export class VenuesModule {}
