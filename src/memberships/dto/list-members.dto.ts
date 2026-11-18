

import {IsOptional } from 'class-validator';


export class ListMembersDto {
  @IsOptional()
  role?: string;
}
