import {Body,Controller, Delete, Get,Param, ParseIntPipe, Patch, Post, Query, UseGuards} from '@nestjs/common';
import { VenuesService } from './venues.service.js';
import { CreateVenueDto } from './dto/create-venue.dto.js';
import { UpdateVenueDto } from './dto/update-venue.dto.js';
import { AvailabilityDto } from './dto/avaliability.dto.js'; 
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/jwt-auth/roles.guard.js';
import { Roles } from '../auth/jwt-auth/roles.decorator.js';
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('venues')
export class VenuesController {
  constructor(private readonly venuesService: VenuesService) {}
 

  @Roles('ADMIN')
  @ApiOperation({ summary: 'Create a venue' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Main Auditorium' },
        location: { type: 'string', example: 'Building A, Floor 2' },
        capacity: { type: 'number', example: 200 },
      },
    },
  })
  @Post()
  create(@Body() body: CreateVenueDto) {
    return this.venuesService.create(body);
  }

  @ApiOperation({ summary: 'Get all venues' })
  @Get()
  findAll() {
    return this.venuesService.findAll();
  }

  @ApiOperation({ summary: 'Get a venue by ID' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.venuesService.findOne(id);
  }

  @ApiOperation({ summary: 'Check venue availability for a date' })
  @Get(':id/availability')
  availability(@Param('id', ParseIntPipe) id: number, @Query() query: AvailabilityDto) {
    return this.venuesService.availability(id, query.date);
  }

  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update a venue' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Main Auditorium' },
        location: { type: 'string', example: 'Building A, Floor 2' },
        capacity: { type: 'number', example: 200 },
      },
    },
  })
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateVenueDto) {
    return this.venuesService.update(id, body);
  }

  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete a venue' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.venuesService.remove(id);
  }
}
