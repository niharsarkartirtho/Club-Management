import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Event } from './entities/event.entity.js';
import { CreateEventDto } from './dto/create-event.dto.js';
import { UpdateEventDto } from './dto/update-event.dto.js';
import { ListEventsDto } from './dto/list-events.dto.js';

@Injectable()
export class EventsService {
    constructor(
        @InjectRepository(Event)
        private readonly eventRepository: Repository<Event>,
    ) { }

    private validateEventDates(startTime: Date, endTime: Date) {
        if (endTime <= startTime) {
            throw new BadRequestException(
                'Event end time must be later than start time',
            );
        }
    }

    async create(dto: CreateEventDto) {
        const startTime = new Date(dto.startTime);
        const endTime = new Date(dto.endTime);

        this.validateEventDates(startTime, endTime);
        const event = this.eventRepository.create({
            ...dto,
            startTime: new Date(dto.startTime),
            endTime: new Date(dto.endTime),
        });

        return await this.eventRepository.save(event);
    }

    async findAll(query: ListEventsDto) {
        const {
            clubId,
            status,
            from,
            to,
            sort = 'asc',
            page = 1,
            limit = 10,
        } = query;

        const queryBuilder = this.eventRepository
            .createQueryBuilder('event');

        if (clubId !== undefined) {
            queryBuilder.andWhere('event.clubId = :clubId', { clubId });
        }

        if (status) {
            queryBuilder.andWhere('event.status = :status', { status });
        }

        if (from) {
            queryBuilder.andWhere('event.startTime >= :from', {
                from: new Date(from),
            });
        }

        if (to) {
            queryBuilder.andWhere('event.startTime <= :to', {
                to: new Date(to),
            });
        }

        queryBuilder
            .orderBy('event.startTime', sort.toUpperCase() as 'ASC' | 'DESC')
            .skip((page - 1) * limit)
            .take(limit);

        const [data, total] = await queryBuilder.getManyAndCount();

        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async findOne(id: number) {
        const event = await this.eventRepository.findOne({
            where: { id },
        });

        if (!event) {
            throw new NotFoundException(`Event with ID ${id} not found`);
        }

        return event;
    }

    async update(id: number, dto: UpdateEventDto) {
        const event = await this.findOne(id);
        const nextStartTime = dto.startTime
            ? new Date(dto.startTime)
            : event.startTime;

        const nextEndTime = dto.endTime
            ? new Date(dto.endTime)
            : event.endTime;

        this.validateEventDates(nextStartTime, nextEndTime);

        Object.assign(event, {
            ...dto,
            ...(dto.startTime && { startTime: new Date(dto.startTime) }),
            ...(dto.endTime && { endTime: new Date(dto.endTime) }),
        });

        return await this.eventRepository.save(event);
    }

    async remove(id: number) {
        const event = await this.findOne(id);

        await this.eventRepository.remove(event);

        return {
            message: 'Event deleted successfully',
        };
    }
}