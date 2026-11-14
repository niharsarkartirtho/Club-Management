import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entites/user.entity.js';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(@InjectRepository(User) private readonly userRepo:Repository<User>){}

    async register(registerDto: RegisterDto) {
        const prevEmail = await this.userRepo.findOne({
            where:{email:registerDto.email}
        });

        if(prevEmail){
            throw new ConflictException("Email is already Registerd");
        }

        const prevId = await this.userRepo.findOne({
            where:{studentId:registerDto.studentId}
        });
        
        if(prevId){
            throw new ConflictException("Student id already registered");
        }

        const password_hash= await bcrypt.hash(registerDto.password,10);

        const user = this.userRepo.create({
            name:registerDto.name,
            email:registerDto.email,
            studentId:registerDto.studentId,
            department:registerDto.department,
            password:password_hash,
        });

        const saveUser = await this.userRepo.save(user);

        const {password,...result} =saveUser;
        return {
            message:"user registered succesfully",
            user:result
        };
    }
}
