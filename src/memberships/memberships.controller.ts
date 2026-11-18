import { Body, Controller, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { MembershipsService } from './memberships.service.js';
import type { AuthRequest } from '../auth/jwt-auth/jwt-auth.guard.js';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard.js';


@UseGuards(JwtAuthGuard)
@Controller('memberships')
export class MembershipsController {
  constructor(private readonly membershipsService: MembershipsService) {}




  @Post(':clubId/join')
  async createMember(
    @Req() req: AuthRequest,
    @Param('clubId', ParseIntPipe) clubId: number,
    @Body() body: { status: string, clubRole: string},
  ) {
    return this.membershipsService.createMember(req.user, clubId, body.status, body.clubRole);
  }





}
