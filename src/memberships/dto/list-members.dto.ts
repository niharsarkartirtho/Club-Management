import {  IsString } from 'class-validator';

export class ListMembersDto {

  @IsString()
  clubRole: string;


  @IsString()
  status: string;
}