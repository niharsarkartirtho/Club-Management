import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ClubsService } from './clubs.service.js';
import { CreateClubDto } from './dto/create-club.dto.js';
import { ApiBody, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import type { AuthRequest } from '../auth/jwt-auth/jwt-auth.guard.js';
import { ListClubsDto } from './dto/list-clubs.dto.js';
import { UpdateClubDto } from './dto/update-club.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard.js';


@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('clubs')
export class ClubsController {
  constructor(private readonly clubsService: ClubsService) {}



  @ApiOperation({ summary: 'List clubs pending approval' })
  @Get('pending')
  findPending(@Query() query: ListClubsDto, @Req() req: AuthRequest) {
    query.status='PENDING'
    return this.clubsService.findAllClubs(query)
  }

  @ApiOperation({ summary: 'Update a club status' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ACTIVE' },
      },
    },
  })
  @Patch('status/:id')
  changeClubStatus(
    @Param('id', ParseIntPipe) clubId: number,
    @Body() reqBody: UpdateClubDto,
    @Req() req: AuthRequest,
  ) {
    return this.clubsService.updateClubStatus(req.user, clubId, {status: reqBody.status});
  }


  @ApiOperation({ summary: 'Create a club' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['name', 'category'],
      properties: {
        name: { type: 'string', minLength: 3, example: 'AIUB Programming Club' },
        description: { type: 'string', example: 'A club for programming enthusiasts' },
        status: { type: 'string', example: 'PENDING' },
        category: { type: 'string', example: 'Technology' },
      },
    },
  })
  @Post()
  create(@Body() body: CreateClubDto, @Req() req: AuthRequest) {
    let userID=  req.user.sub;
    return this.clubsService.create(userID, body, req);
  }

    @ApiOperation({ summary: 'Get a club by ID' })
    @Get(':id')
      findOne(@Param('id', ParseIntPipe) clubId: number) {
      return this.clubsService.findOneClubById(clubId);
    }



  @ApiOperation({ summary: 'List clubs with optional filters' })
  @Get()
  findAllClub(@Query() query: ListClubsDto, @Req() req: AuthRequest) {
    return this.clubsService.findAllClubs(query);
  }

  @ApiOperation({ summary: 'Update a club' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', minLength: 3, example: 'AIUB Programming Club' },
        description: { type: 'string', example: 'A club for programming enthusiasts' },
        status: { type: 'string', example: 'ACTIVE' },
        category: { type: 'string', example: 'Technology' },
      },
    },
  })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) clubId: number,
    @Body() body: UpdateClubDto,
    @Req() req: AuthRequest,
  ) {
    return this.clubsService.updateClub(req.user, clubId, body);
  }




  @ApiOperation({ summary: 'Delete a club' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) clubId: number, @Req() req: AuthRequest,) {
    return this.clubsService.removeClub(clubId, req.user);
  }
}
