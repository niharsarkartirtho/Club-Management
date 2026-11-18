import {  IsString } from 'class-validator';

export class CreateMembershipDto {

  @IsString()
  clubRole: string;


  @IsString()
  status: string;
}