import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto.js';

export class SearchUsersDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string;
}
