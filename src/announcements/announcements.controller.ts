import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';

import { AnnouncementsService } from './announcements.service.js';
import { CreateAnnouncementDto } from './dto/create-announcement.dto.js';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto.js';

@Controller('announcements')
export class AnnouncementsController {
    constructor(
        private readonly announcementsService: AnnouncementsService,
    ) { }

    @Post()
    create(@Body() dto: CreateAnnouncementDto) {
        return this.announcementsService.create(dto);
    }

    @Get()
    findAll() {
        return this.announcementsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.announcementsService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() dto: UpdateAnnouncementDto) {
        return this.announcementsService.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.announcementsService.remove(id);
    }
}
