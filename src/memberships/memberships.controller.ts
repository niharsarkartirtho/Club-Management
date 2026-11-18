import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { MembershipsService } from './memberships.service.js';
import type { AuthRequest } from '../auth/jwt-auth/jwt-auth.guard.js';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard.js';
import { CreateMembershipDto } from './dto/create-membership.dto.js';
import { UpdateMembershipDto } from './dto/update-membership.dto.js';


@UseGuards(JwtAuthGuard)
@Controller('memberships')
export class MembershipsController {
  constructor(private readonly membershipsService: MembershipsService) {}



  @Post(':clubId/join')
  async createMember(
    @Req() req: AuthRequest,
    @Param('clubId', ParseIntPipe) clubId: number,
    @Body() body: CreateMembershipDto,
  ) {
    return this.membershipsService.createMember(req.user, clubId, body.status, body.clubRole,);
  }



  @Get('filter/:clubId')
  async filterMember(
    @Param('clubId', ParseIntPipe) clubId: number,
    @Query() filters: CreateMembershipDto,
  ) {
    return this.membershipsService.filterMember(clubId, filters);
  }



  @Patch(':membershipId')
  async updateMember(
    @Param('membershipId', ParseIntPipe) membershipId: number,
    @Body() body: UpdateMembershipDto,
  ) {
    return this.membershipsService.updateMember(membershipId, body);
  }




}
