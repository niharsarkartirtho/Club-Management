import { Controller,UseGuards, Get, Req,Patch,Body,Param,ParseIntPipe,Delete,Query } from '@nestjs/common';
import { UsersService } from './users.service.js';
import type { AuthRequest } from '../auth/jwt-auth/jwt-auth.guard.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';
import { ChangePasswordDto } from './dto/change-password.dto.js';
import { RolesGuard } from '../auth/jwt-auth/roles.guard.js';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard.js';
import { Roles } from '../auth/jwt-auth/roles.decorator.js';
import { ChangeRoleDto } from './dto/change-role.dto.js';
import { SearchUsersDto } from './dto/search-users.dto.js';
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({summary: 'See my profile info'})
  @Get('my-profile')
  getMe(@Req() req: AuthRequest) {
    return this.usersService.findone(req.user.sub);
  }

  @ApiOperation({summary: 'Update my profile'})
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', minLength: 2, example: 'Nihar Sarkar Tirtho' },
        studentId: { type: 'string', example: '23-55293-3' },
        department: { type: 'string', example: 'CSE' },
      },
    },
  })
  @Patch('update-profile')
  updateMe(@Req() req: AuthRequest, @Body() body: UpdateProfileDto) {
    return this.usersService.UpdateProfile(req.user.sub, body);
  }

  @ApiOperation({summary: 'Change my password'})
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        oldPassword: { type: 'string', example: 'oldPassword123' },
        newPassword: { type: 'string', minLength: 6, example: 'newPassword456' },
      },
    },
  })
  @Patch('change-password')
  changePassword(@Req() req: AuthRequest, @Body() body: ChangePasswordDto) {
    return this.usersService.changePassword(req.user.sub, body);
  }
 

  @ApiOperation({summary: 'search a user by id only accessed by admins'})
  @Roles('ADMIN')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findone(id);
  }

  @ApiOperation({summary: 'change a user role only accessed by admins'})
  @Roles('ADMIN')
  @Patch(':id/role')
  changeRole(@Param('id', ParseIntPipe) id: number, @Body() body: ChangeRoleDto) {
    return this.usersService.changeRole(id, body);
  }

  @ApiOperation({summary: 'delete a user by id only accessed by admins'})
  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }

  @ApiOperation({summary: 'find all users by his name or email or student id only accessed by admins'})
  @Roles('ADMIN')
  @Get()
  findAll(@Query() query: SearchUsersDto) {
    return this.usersService.findAll(query);
  }
}
