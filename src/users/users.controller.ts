import { Controller,UseGuards, Get, Req,Patch,Body,Param,ParseIntPipe,Delete } from '@nestjs/common';
import { UsersService } from './users.service.js';
import type { AuthRequest } from '../auth/jwt-auth/jwt-auth.guard.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';
import { ChangePasswordDto } from './dto/change-password.dto.js';
import { RolesGuard } from '../auth/jwt-auth/roles.guard.js';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard.js';
import { Roles } from '../auth/jwt-auth/roles.decorator.js';
import { ChangeRoleDto } from './dto/change-role.dto.js';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('my-profile')
  getMe(@Req() req: AuthRequest) {
    return this.usersService.findone(req.user.sub);
  }

  @Patch('update-profile')
  updateMe(@Req() req: AuthRequest, @Body() body: UpdateProfileDto) {
    return this.usersService.UpdateProfile(req.user.sub, body);
  }

  @Patch('change-password')
  changePassword(@Req() req: AuthRequest, @Body() body: ChangePasswordDto) {
    return this.usersService.changePassword(req.user.sub, body);
  }
 

  @Roles('ADMIN')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findone(id);
  }

  @Roles('ADMIN')
  @Patch(':id/role')
  changeRole(@Param('id', ParseIntPipe) id: number, @Body() body: ChangeRoleDto) {
    return this.usersService.changeRole(id, body);
  }

  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
