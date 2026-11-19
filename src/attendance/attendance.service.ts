import {
    Injectable,
    NotFoundException,
    ConflictException,
    BadRequestException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Attendance } from './entities/attendance.entity.js';
import { CreateAttendanceDto } from './dto/create-attendance.dto.js';
import { UpdateAttendanceDto } from './dto/update-attendance.dto.js';

@Injectable()
export class AttendanceService {
    constructor(
        @InjectRepository(Attendance)
        private attendanceRepository: Repository<Attendance>,
    ) { }

    async create(dto: CreateAttendanceDto) {
        const existing = await this.attendanceRepository.findOne({
            where: {
                registration: { id: +dto.registrationId },
            },
        });

        if (existing) {
            throw new ConflictException(
                'Attendance already exists for this registration',
            );
        }

        const attendance = this.attendanceRepository.create({
            registration: { id: +dto.registrationId },
            checkedInByUser: { id: +dto.checkedInBy },
        });

        return await this.attendanceRepository.save(attendance);
    }

    async findAll() {
        return await this.attendanceRepository.find({
            relations: {
                registration: true,
                checkedInByUser: true,
            },
        });
    }

    async findOne(id: number) {
        const attendance = await this.attendanceRepository.findOne({
            where: { id },
            relations: {
                registration: true,
                checkedInByUser: true,
            },
        });

        if (!attendance) {
            throw new NotFoundException('Attendance not found');
        }

        return attendance;
    }

    async update(id: number, dto: UpdateAttendanceDto) {
        if (Object.keys(dto).length === 0) {
            throw new BadRequestException(
                'At least one field is required for update',
            );
        }

        const attendance = await this.findOne(id);

        if (dto.registrationId) {
            attendance.registration = {
                id: +dto.registrationId,
            } as any;
        }

        if (dto.checkedInBy) {
            attendance.checkedInByUser = {
                id: +dto.checkedInBy,
            } as any;
        }

        return await this.attendanceRepository.save(attendance);
    }

    async remove(id: number) {
        const attendance = await this.findOne(id);

        await this.attendanceRepository.remove(attendance);

        return {
            message: 'Attendance deleted successfully',
            deletedId: id,
        };
    }
}