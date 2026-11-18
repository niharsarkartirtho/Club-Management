import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Membership } from './entities/membership.entity.js';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthUser } from '../auth/jwt-auth/jwt-auth.guard.js';
import { Club } from '../clubs/entities/club.entity.js';
import { ListMembersDto } from './dto/list-members.dto.js';

@Injectable()
export class MembershipsService {

  constructor(
    @InjectRepository(Membership) private readonly membershipRepo: Repository<Membership>,
    @InjectRepository(Club) private readonly clubRepo: Repository<Club>,
  ) {}

  findMembership(userId: number, clubId: number) {
    return this.membershipRepo.findOne({
      where: { user: { id: userId }, club: { id: clubId } },
      relations: { user: true, club: true},
    });
  }

  async findClubOrFail(clubId: number) {
    const club = await this.clubRepo.findOne({ where: { id: clubId } });
    if (!club) {
      throw new NotFoundException('club not found');
    }
    return club;
  }



  async createMember(user: AuthUser, clubId: number, status: string, role: string){
    const clubData = await this.findClubOrFail(clubId);
    if (clubData.status !== 'ACTIVE') {
      throw new BadRequestException('You can Join Only Active Club');
    }

    const oldMembership = await this.findMembership(user.sub, clubId);
    if (oldMembership && oldMembership.status !== 'LEFT') {
      throw new ConflictException('you Already joined this club');
    }

    const membership = this.membershipRepo.create({
      user: { id: user.sub },
      club: { id: clubId },
      clubRole: role,
      status: status
    });
    return await this.membershipRepo.save(membership);
  }



  async filterMember(clubId: number, filters: ListMembersDto) {
    await this.findClubOrFail(clubId);

    return this.membershipRepo.find({
      where: {
        club: { id: clubId },
        ...(filters.clubRole && { clubRole: filters.clubRole }),
        ...(filters.status && { status: filters.status }),
      },
      relations: {
        user: true,
        club: true
      },
      order: {
        joinedAt: 'DESC',
      },
    });
  }





}
