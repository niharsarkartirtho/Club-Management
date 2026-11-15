
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAttendanceDto {
    @IsString()
    @IsNotEmpty()
    registrationId: string;

    @IsString()
    @IsNotEmpty()
    checkedInBy: string;
}
