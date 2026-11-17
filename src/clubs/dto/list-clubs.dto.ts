import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto.js';

export class ListClubsDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsString()
  @IsOptional()
  status: string;


  @IsOptional()
  @IsString()
  category?: string;
}
