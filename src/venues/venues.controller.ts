import {Body,Controller, Delete, Get,Param, ParseIntPipe, Patch, Post, Query, UseGuards} from '@nestjs/common';
import { VenuesService } from './venues.service.js';
import { CreateVenueDto } from './dto/create-venue.dto.js';
import { UpdateVenueDto } from './dto/update-venue.dto.js';
import { AvailabilityDto } from './dto/avaliability.dto.js'; 
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/jwt-auth/roles.guard.js';
import { Roles } from '../auth/jwt-auth/roles.decorator.js';



@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('venues')
export class VenuesController {
  constructor(private readonly venuesService: VenuesService) {}
 

  @Roles('ADMIN')
  @Post()
  create(@Body() body: CreateVenueDto) {
    return this.venuesService.create(body);
  }

  @Get()
  findAll() {
    return this.venuesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.venuesService.findOne(id);
  }

  @Get(':id/availability')
  availability(@Param('id', ParseIntPipe) id: number, @Query() query: AvailabilityDto) {
    return this.venuesService.availability(id, query.date);
  }

  @Roles('ADMIN')
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateVenueDto) {
    return this.venuesService.update(id, body);
  }

  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.venuesService.remove(id);
  }
}
