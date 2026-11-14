import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Announcement } from './entities/announcement.entity.js';
import { CreateAnnouncementDto } from './dto/create-announcement.dto.js';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto.js';

@Injectable()
export class AnnouncementsService {
    constructor(
        @InjectRepository(Announcement)
        private readonly announcementRepository: Repository<Announcement>,
    ) { }

    async create(dto: CreateAnnouncementDto) {
        const announcement = this.announcementRepository.create(dto);
        return this.announcementRepository.save(announcement);
    }

    async findAll() {
        return this.announcementRepository.find();
    }

    async findOne(id: string) {
        const announcement = await this.announcementRepository.findOne({
            where: { id },
        });

        if (!announcement) {
            throw new NotFoundException('Announcement not found');
        }

        return announcement;
    }

    async update(id: string, dto: UpdateAnnouncementDto) {
        const announcement = await this.findOne(id);
        Object.assign(announcement, dto);

        return this.announcementRepository.save(announcement);
    }

    async remove(id: string) {
        const announcement = await this.findOne(id);
        await this.announcementRepository.remove(announcement);

        return { message: 'Announcement deleted successfully' };
    }
}
