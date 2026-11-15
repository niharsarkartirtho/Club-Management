import { IsDateString, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

import { EventVisibility } from '../entities/event.entity.js';

export class CreateEventDto {
    @IsInt()
    venueId: number;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsDateString()
    startTime: string;

    @IsDateString()
    endTime: string;

    @IsInt()
    @Min(1)
    capacity: number;

    @IsOptional()
    @IsEnum(EventVisibility)
    visibility?: EventVisibility;
}