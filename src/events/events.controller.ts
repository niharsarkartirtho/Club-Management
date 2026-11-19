import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';

import { EventsService } from './events.service.js';
import { CreateEventDto } from './dto/create-event.dto.js';
import { UpdateEventDto } from './dto/update-event.dto.js';
import { ListEventsDto } from './dto/list-events.dto.js';
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('events')
export class EventsController {
    constructor(
        private readonly eventsService: EventsService,
    ) { }

    @ApiOperation({ summary: 'Create a new event' })
    @ApiBody({ type: CreateEventDto })
    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() dto: CreateEventDto) {
        return this.eventsService.create(dto);
    }

    @ApiOperation({ summary: 'Get all events with filters and pagination' })
    @Get()
    @HttpCode(HttpStatus.OK)
    findAll(@Query() query: ListEventsDto) {
        return this.eventsService.findAll(query);
    }

    @ApiOperation({ summary: 'Get event by id' })
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.eventsService.findOne(id);
    }

    @ApiOperation({ summary: 'Update an event' })
    @ApiBody({ type: UpdateEventDto })
    @Put(':id')
    @HttpCode(HttpStatus.OK)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateEventDto,
    ) {
        return this.eventsService.update(id, dto);
    }

    @ApiOperation({ summary: 'Delete an event' })
    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.eventsService.remove(id);
    }
}