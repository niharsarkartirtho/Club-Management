import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateClubDto } from './dto/create-club.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Club } from './entities/club.entity.js';
import { ILike, Repository } from 'typeorm';
import { ListClubsDto } from './dto/list-clubs.dto.js';
import { UpdateClubDto } from './dto/update-club.dto.js';
import { AuthUser } from '../auth/jwt-auth/jwt-auth.guard.js';
import { User } from '../users/entites/user.entity.js';

@Injectable()
export class ClubsService {

  constructor(
    @InjectRepository(Club) private readonly clubRepo: Repository<Club>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}



  async create(userId: number, body: CreateClubDto) {

    const existClub = await this.clubRepo.findOne({ where: { name: body.name } });

    if (existClub) {
      throw new ConflictException('Club with this Name Already Exists');
    }

    const club = this.clubRepo.create({
      name: body.name,
      description: body.description,
      category: body.category,
      status: body.status,
      createdBy: { id: userId },
    });
    const savedClub = await this.clubRepo.save(club);


    return {
      message: 'club requested, wait for admin approval',
      club: savedClub,
    };
  }



  async findOneClubById(id: number) {
    const club = await this.clubRepo.findOne({
      where: {id},
      relations: { createdBy: true},
    });
    if (!club) {
      throw new NotFoundException('Club Not Found');
    }
    return club;
  }


  async findAllClubs(query: ListClubsDto) {
    const page = query.page || 1;
    const limit = query.limit || 10;

    let status = query.status

    if(!status){
      status = 'ACTIVE'
    }
    const where: any = { status: status };
    if (query.search) {
      where.name = ILike(`%${query.search}%`);
    }
    if (query.category) {
      where.category = query.category;
    }

    const [items, total] = await this.clubRepo.findAndCount({
      where: where,
      order: { name: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { items, total, page, limit };
  }



  async updateClub(user: AuthUser, clubId: number, body: UpdateClubDto) {

      const membership = {
        id: 1,
        userId: 2,
        clubId: 1,
        role: 'PRESIDENT',
        status: 'ACTIVE',
        joinedAt: new Date(),
      };

      const club = await this.findOneClubById(clubId)
      if (!club) {
        throw new NotFoundException('Club not found');
      }

      if (membership.userId !== user.sub || membership.clubId !== clubId || membership.role !== 'PRESIDENT' || membership.status !== 'ACTIVE') {
        throw new ForbiddenException('Only President can Modify Club');
      }


      if (body.name !== club.name) {
        const nameUsed = await this.clubRepo.findOne({
          where: { name: body.name },
        });

        if (nameUsed) {
          throw new ConflictException('This Club Name Already Exists');
        }
      }

      if (body.name) {
        club.name = body.name;}
      if (body.description) {
        club.description = body.description;}
      if (body.category) {
        club.category = body.category;}

      return this.clubRepo.save(club);
    }



  async removeClub(clubId: number, body: AuthUser) {


    const membership = {
      id: 1,
      userId: 2,
      clubId: 2,
      role: 'PRESIDENT',
      status: 'ACTIVE',
      joinedAt: new Date(),
    };

    const club = await this.findOneClubById(clubId)
    if (!club) {
      throw new NotFoundException('Club Not Found');
    }


    if (membership.userId !== body.sub || membership.clubId !== clubId || membership.role !== 'PRESIDENT' || membership.status !== 'ACTIVE') {
      throw new ForbiddenException('Only President can Delete Club');
    }


    await this.clubRepo.remove(club);
    return { msg: 'Club Deleted' };

  }




}
