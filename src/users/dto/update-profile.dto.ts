import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  name: string;

  @IsOptional()
  @IsString()
  studentId: string;

  @IsOptional()
  @IsString()
  department: string;
}