import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto.js';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SearchUsersDto extends PaginationDto {
   @ApiPropertyOptional({
    description: 'Filter by email or name or student id',
    example: '@tirtho@gmail.com or Tirtho or 23-55293-3' ,
  })
  @IsOptional()
  @IsString()
  search?: string;
}
