
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Event } from '../events/entities/event.entity.js';
import { Registration } from '../event-registrations/entities/event-registration.entity.js';
import { Attendance } from '../attendance/entities/attendance.entity.js';
import { Club } from '../clubs/entities/club.entity.js';
import { User } from '../users/entites/user.entity.js';

@Injectable()
export class AnalyticsService {
    constructor(
        @InjectRepository(Event)
        private eventRepo: Repository<Event>,

        @InjectRepository(Registration)
        private registrationRepo: Repository<Registration>,

        @InjectRepository(Attendance)
        private attendanceRepo: Repository<Attendance>,

        @InjectRepository(Club)
        private clubRepo: Repository<Club>,

        @InjectRepository(User)
        private userRepo: Repository<User>,
    ) { }

    // Event Statistics
    async eventStats(id: number) {
        const event = await this.eventRepo.findOne({
            where: { id: id },
        });

        if (!event) {
            throw new NotFoundException('Event not found');
        }

        const registered = await this.registrationRepo.count({
            where: {
                event: { id: id },
                status: 'REGISTERED',
            },
        });

        const waitlisted = await this.registrationRepo.count({
            where: {
                event: { id: id },
                status: 'WAITLISTED',
            },
        });

        const attended = await this.attendanceRepo.count({
            where: {
                registration: {
                    event: { id: id },
                },
            },
        });

        const noShow = registered - attended;

        let fillRate = 0;
        if (event.capacity > 0) {
            fillRate = (registered / event.capacity) * 100;
        }

        let noShowRate = 0;
        if (registered > 0) {
            noShowRate = (noShow / registered) * 100;
        }

        return {
            eventId: event.id,
            title: event.title,
            capacity: event.capacity,
            registered,
            waitlisted,
            attended,
            noShow,
            fillRate: Math.round(fillRate),
            noShowRate: Math.round(noShowRate),
        };
    }

    // Admin Overview
    async adminOverview() {
        const users = await this.userRepo.count();
        const clubs = await this.clubRepo.count();
        const events = await this.eventRepo.count();

        const registrations = await this.registrationRepo.count({
            where: { status: 'REGISTERED' },
        });

        const attendance = await this.attendanceRepo.count();

        return {
            users,
            clubs,
            events,
            registrations,
            attendance,
        };
    }
}
