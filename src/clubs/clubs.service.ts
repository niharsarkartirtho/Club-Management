import { ConflictException, Injectable } from '@nestjs/common';
import { CreateClubDto } from './dto/create-club.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Club } from './entities/club.entity.js';
import { ILike, Repository } from 'typeorm';
import { ListClubsDto } from './dto/list-clubs.dto.js';

@Injectable()
export class ClubsService {

  constructor(
    @InjectRepository(Club) private readonly clubRepo: Repository<Club>,
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



}
