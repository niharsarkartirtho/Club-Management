import {
    IsString,
    IsUUID,
    IsOptional,
    IsInt,
} from 'class-validator';

export class CreateAnnouncementDto {
    @IsUUID()
    clubId: string;

    @IsOptional()
    @IsUUID()
    eventId?: string;

    @IsInt()
    authorId: number;

    @IsString()
    title: string;

    @IsString()
    body: string;
}
