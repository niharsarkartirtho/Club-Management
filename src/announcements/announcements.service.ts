import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
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
        try {
            const announcement = this.announcementRepository.create(dto);
            return await this.announcementRepository.save(announcement);
        } catch (error) {
            this.handleDatabaseError(error);
        }
    }

    async findAll(page: number = 1, limit: number = 10) {
        const [data, total] = await this.announcementRepository.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
            order: {
                id: 'DESC',
            },
        });

        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async findOne(id: number) {
        const announcement = await this.announcementRepository.findOne({
            where: { id },
        });

        if (!announcement) {
            throw new NotFoundException({
                statusCode: 404,
                message: 'Announcement not found',
                error: 'Not Found',
            });
        }

        return announcement;
    }

    async update(id: number, dto: UpdateAnnouncementDto) {
        const announcement = await this.findOne(id);

        Object.assign(announcement, dto);

        try {
            return await this.announcementRepository.save(announcement);
        } catch (error) {
            this.handleDatabaseError(error);
        }
    }

    async remove(id: number) {
        const announcement = await this.findOne(id);

        await this.announcementRepository.remove(announcement);

        return {
            message: 'Announcement deleted successfully',
        };
    }
    private handleDatabaseError(error: any): never {
        if (error?.code === '23505') {
            throw new ConflictException('This record already exists');
        }

        throw error;
    }
}