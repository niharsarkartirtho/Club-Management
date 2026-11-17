import { Body, Controller, Post, Req } from '@nestjs/common';
import { ClubsService } from './clubs.service.js';
import { CreateClubDto } from './dto/create-club.dto.js';
//import { AuthRequest } from '../auth/jwt-auth/jwt-auth.guard.js';
import type { AuthRequest } from '../auth/jwt-auth/jwt-auth.guard.js';

@Controller('clubs')
export class ClubsController {
  constructor(private readonly clubsService: ClubsService) {}

  @Post()
  create(@Body() body: CreateClubDto, @Req() req: AuthRequest) {
    let userID=  req.user?.sub || 2;
    return this.clubsService.create(userID, body);
  }



}
