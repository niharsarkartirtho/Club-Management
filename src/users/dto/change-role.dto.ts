import { IsEnum } from 'class-validator';
import { Role } from '../entites/user.entity.js';

export class ChangeRoleDto {
  @IsEnum(Role)
  role: Role;
}
