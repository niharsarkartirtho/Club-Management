
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { MembershipsService } from './memberships.service.js';
import type { AuthRequest } from '../auth/jwt-auth/jwt-auth.guard.js';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard.js';
import { CreateMembershipDto } from './dto/create-membership.dto.js';
import { UpdateMembershipDto } from './dto/update-membership.dto.js';

@ApiTags('Memberships')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('memberships')
export class MembershipsController {
  constructor(
    private readonly membershipsService: MembershipsService,
  ) {}

  @ApiOperation({
    summary: 'Join a club',
    description: 'Create a membership request for a specific club.',
  })
  @ApiParam({
    name: 'clubId',
    type: Number,
    example: 1,
  })
  @ApiBody({ type: CreateMembershipDto })
  @Post(':clubId/join')
  async createMember(
    @Req() req: AuthRequest,
    @Param('clubId', ParseIntPipe) clubId: number,
    @Body() body: CreateMembershipDto,
  ) {
    return this.membershipsService.createMember(
      req.user,
      clubId,
      body.status,
      body.clubRole,
    );
  }

  @ApiOperation({
    summary: 'Filter club members',
    description: 'Get club members using optional filters.',
  })
  @ApiParam({
    name: 'clubId',
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'status',
    required: false,
    example: 'ACTIVE',
  })
  @ApiQuery({
    name: 'clubRole',
    required: false,
    example: 'PRESIDENT',
  })
  @Get('filter/:clubId')
  async filterMember(
    @Param('clubId', ParseIntPipe) clubId: number,
    @Query() filters: CreateMembershipDto,
  ) {
    return this.membershipsService.filterMember(clubId, filters);
  }

  @ApiOperation({
    summary: 'Update membership',
    description: 'Update membership status or club role.',
  })
  @ApiParam({
    name: 'membershipId',
    type: Number,
    example: 1,
  })
  @ApiBody({ type: UpdateMembershipDto })
  @Patch(':membershipId')
  async updateMember(
    @Param('membershipId', ParseIntPipe) membershipId: number,
    @Body() body: UpdateMembershipDto,
  ) {
    return this.membershipsService.updateMember(
      membershipId,
      body,
    );
  }
}
