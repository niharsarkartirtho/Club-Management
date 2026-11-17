import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ClubsService } from './clubs.service.js';
import { CreateClubDto } from './dto/create-club.dto.js';
//import { AuthRequest } from '../auth/jwt-auth/jwt-auth.guard.js';
import type { AuthRequest } from '../auth/jwt-auth/jwt-auth.guard.js';
import { ListClubsDto } from './dto/list-clubs.dto.js';
import { UpdateClubDto } from './dto/update-club.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard.js';

@UseGuards(JwtAuthGuard)
@Controller('clubs')
export class ClubsController {
  constructor(private readonly clubsService: ClubsService) {}


  @Post()
  create(@Body() body: CreateClubDto, @Req() req: AuthRequest) {
    let userID=  req.user.sub;
    return this.clubsService.create(userID, body);
  }

    @Get(':id')
      findOne(@Param('id', ParseIntPipe) clubId: number) {
      return this.clubsService.findOneClubById(clubId);
    }



  @Get()
  findAllClub(@Query() query: ListClubsDto, @Req() req: AuthRequest) {
    return this.clubsService.findAllClubs(query);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) clubId: number,
    @Body() body: UpdateClubDto,
    @Req() req: AuthRequest,
  ) {
    return this.clubsService.updateClub(req.user, clubId, body);
  }




  @Delete(':id')
  remove(@Param('id', ParseIntPipe) clubId: number, @Req() req: AuthRequest,) {
    return this.clubsService.removeClub(clubId, req.user);
  }






}
