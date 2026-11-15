import { IsString, IsOptional, IsInt, IsNotEmpty } from 'class-validator';

export class CreateAnnouncementDto {
    @IsOptional()
    @IsInt()
    clubId?: number;

    @IsOptional()
    @IsInt()
    eventId?: number;

    @IsOptional()
    @IsInt()
    authorId?: number;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    body: string;
}