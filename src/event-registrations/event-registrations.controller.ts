
import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { EventRegistrationsService } from './event-registrations.service.js';
import {
  JwtAuthGuard,
  type AuthRequest,
} from '../auth/jwt-auth/jwt-auth.guard.js';

@ApiTags('Event Registrations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('event-registrations')
export class EventRegistrationsController {
  constructor(
    private readonly eventRegistrationsService: EventRegistrationsService,
  ) {}

  @ApiOperation({
    summary: 'Register for an event',
    description: 'Register the logged-in user for a specific event.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
    description: 'Event ID',
  })
  @Post('reg/:id')
  register(
    @Param('id', ParseIntPipe) eventId: number,
    @Req() req: AuthRequest,
  ) {
    return this.eventRegistrationsService.registerEvent(
      req.user,
      eventId,
    );
  }



  @ApiOperation({
    summary: 'Get my event registrations',
    description: 'Retrieve all event registrations of the logged-in user.',
  })
  @Get('me')
  myRegistrations(@Req() req: AuthRequest) {
    return this.eventRegistrationsService.myRegistrations(
      req.user.sub,
    );
  }
}
