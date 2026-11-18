
import {
    Injectable,
    NotFoundException,
    ConflictException,
    BadRequestException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';

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
        const existing = await this.attendanceRepository.findOneBy({
            registrationId: dto.registrationId,
        });
        if (existing) {
            throw new ConflictException(
                'Attendance already exists for this registration',
            );
        }
        try {
            const attendance = this.attendanceRepository.create(dto);
            return await this.attendanceRepository.save(attendance);
        } catch (error) {
            if (
                error instanceof QueryFailedError &&
                (error as any).driverError?.code === '23505'
            ) {
                throw new ConflictException('Duplicate attendance record');
            }
            throw error;
        }
    }

    async findAll() {
        return await this.attendanceRepository.find();
    }

    async findOne(id: number) {
        const attendance = await this.attendanceRepository.findOneBy({ id });
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
        Object.assign(attendance, dto);
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
