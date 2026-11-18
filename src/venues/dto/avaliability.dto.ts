import { IsDateString } from 'class-validator';

export class AvailabilityDto {
  @IsDateString()
  date: string;
}
