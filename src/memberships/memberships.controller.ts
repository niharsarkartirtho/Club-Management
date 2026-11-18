import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, Req, UseGuards } from '@nestjs/common';
import { MembershipsService } from './memberships.service.js';
import type { AuthRequest } from '../auth/jwt-auth/jwt-auth.guard.js';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard.js';
import { ListMembersDto } from './dto/list-members.dto.js';


@UseGuards(JwtAuthGuard)
@Controller('memberships')
export class MembershipsController {
  constructor(private readonly membershipsService: MembershipsService) {}



  @Post(':clubId/join')
  async createMember(
    @Req() req: AuthRequest,
    @Param('clubId', ParseIntPipe) clubId: number,
    @Body() body: ListMembersDto,
  ) {
    return this.membershipsService.createMember(req.user, clubId, body.status, body.clubRole,);
  }



  @Get('filter/:clubId')
  async filterMember(
    @Param('clubId', ParseIntPipe) clubId: number,
    @Query() filters: ListMembersDto,
  ) {
    return this.membershipsService.filterMember(clubId, filters);
  }






}
