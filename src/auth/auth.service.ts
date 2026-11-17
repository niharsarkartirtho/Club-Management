import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entites/user.entity.js';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto.js';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto.js';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
    constructor(@InjectRepository(User) private readonly userRepo:Repository<User>,
    private readonly jwtService:JwtService,
    ){}

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

    async login(loginDto:LoginDto){
        const user = await this.userRepo.findOne({
            where: { email: loginDto.email },
            select: { id: true, name: true, email: true, role: true, password: true },
        });

        if (!user) {
            throw new UnauthorizedException('Invalid email, email not found');
        }

        const isMatch = await bcrypt.compare(loginDto.password, user.password);
        if (!isMatch) {
            throw new UnauthorizedException('Invalid password, password not matched');
        }

        const payload = {
            sub:user.id,
            email:user.email,
            role:user.role
        };
        
        const access_token = await this.jwtService.signAsync(payload);

        const { password, ...result } = user;
        return {
            message: 'login successful',
            access_token,
            user: result,
        };
    }

    logout() {
        return {
            message: 'logged out'
        };
    }

}
