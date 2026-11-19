import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateClubDto } from './dto/create-club.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Club } from './entities/club.entity.js';
import { ILike, Repository } from 'typeorm';
import { ListClubsDto } from './dto/list-clubs.dto.js';
import { UpdateClubDto } from './dto/update-club.dto.js';
import { AuthRequest, AuthUser } from '../auth/jwt-auth/jwt-auth.guard.js';
import { User } from '../users/entites/user.entity.js';
import { Membership } from '../memberships/entities/membership.entity.js';

@Injectable()
export class ClubsService {

  constructor(
    @InjectRepository(Club) private readonly clubRepo: Repository<Club>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Membership) private readonly membershipRepo: Repository<Membership>,

  ) {}



  async create(userId: number, body: CreateClubDto, req: AuthRequest) {

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

    const membership = this.membershipRepo.create({
      user: { id: req.user.sub },
      club: { id: savedClub.id },
      status: 'ACTIVE',
      clubRole: 'PRESIDENT',
    });

    const savedMembership = await this.membershipRepo.save(membership);

    return {
      message: 'Club Create Success With Role PRESIDENT',
      club: savedClub,
      membership: savedMembership,
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



  async updateClubStatus(user: AuthUser, clubId: number, body: UpdateClubDto) {

    const club = await this.findOneClubById(clubId);

    const membership = await this.membershipRepo.findOne({
      where: {
        user: { id: user.sub },
        club: { id: clubId },
        clubRole: 'PRESIDENT',
        status: 'ACTIVE',
      },
    });

    if (!membership) {
      throw new ForbiddenException('Only President can Update Club Status');
    }

    if (body.status !== undefined) {
      club.status = body.status;
    }

    return this.clubRepo.save(club);
  }



  async updateClub(user: AuthUser, clubId: number, body: UpdateClubDto) {

    const club = await this.findOneClubById(clubId);

    const membership = await this.membershipRepo.findOne({
      where: {
        user: { id: user.sub },
        club: { id: clubId },
        clubRole: 'PRESIDENT',
        status: 'ACTIVE',
      },
    });

    if (!membership) {
      throw new ForbiddenException('Only President can Modify Club');
    }

    if (body.name && body.name !== club.name) {
      const nameUsed = await this.clubRepo.findOne({
        where: { name: body.name },
      });

      if (nameUsed) {
        throw new ConflictException('This Club Name Already Exists');
      }
    }

    // Update fields
    if (body.name !== undefined) {
      club.name = body.name;
    }

    if (body.description !== undefined) {
      club.description = body.description;
    }

    if (body.category !== undefined) {
      club.category = body.category;
    }

    if (body.status !== undefined) {
      club.status = body.status;
    }

    return this.clubRepo.save(club);
  }



  async removeClub(clubId: number, body: AuthUser) {
    const club = await this.findOneClubById(clubId);

    const membership = await this.membershipRepo.findOne({
      where: {
        user: { id: body.sub },
        club: { id: clubId },
        clubRole: 'PRESIDENT',
        status: 'ACTIVE',
      },
    });

    if (!membership) {
      throw new ForbiddenException('Only President can Delete Club');
    }

    await this.clubRepo.remove(club);

    return { msg: 'Club Deleted' };
  }





}
