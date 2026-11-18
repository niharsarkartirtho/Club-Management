import { Controller, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { EventRegistrationsService } from './event-registrations.service.js';
//import { AuthRequest, JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard.js';
import { JwtAuthGuard, type AuthRequest } from '../auth/jwt-auth/jwt-auth.guard.js';
@UseGuards(JwtAuthGuard)
@Controller('event-registrations')
export class EventRegistrationsController {
  constructor(private readonly eventRegistrationsService: EventRegistrationsService) {}



  @Post('reg/:id')
  register(@Param('id', ParseIntPipe) eventId: number, @Req() req: AuthRequest) {
    return this.eventRegistrationsService.registerEvent(req.user, eventId);
  }




  @Get('/me')
  myRegistrations(@Req() req: AuthRequest) {
    return this.eventRegistrationsService.myRegistrations(req.user.sub);
  }






}
