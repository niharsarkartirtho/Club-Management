import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateClubDto {


  @IsString()
  @MinLength(3)
  name: string;


  @IsOptional()
  @IsString()
  description?: string;


  @IsString()
  @IsOptional()
  status: string;


  @IsString()
  @IsNotEmpty()
  category: string;



}
