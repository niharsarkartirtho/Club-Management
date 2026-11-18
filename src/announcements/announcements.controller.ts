import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, Query, HttpCode, HttpStatus } from '@nestjs/common';

import { AnnouncementsService } from './announcements.service.js';
import { CreateAnnouncementDto } from './dto/create-announcement.dto.js';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto.js';

@Controller('announcements')
export class AnnouncementsController {
    constructor(
        private readonly announcementsService: AnnouncementsService,
    ) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() dto: CreateAnnouncementDto) {
        return this.announcementsService.create(dto);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    findAll(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ) {
        return this.announcementsService.findAll(
            Number(page),
            Number(limit),
        );
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.announcementsService.findOne(id);
    }

    @Put(':id')
    @HttpCode(HttpStatus.OK)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateAnnouncementDto,
    ) {
        return this.announcementsService.update(id, dto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.announcementsService.remove(id);
    }
}