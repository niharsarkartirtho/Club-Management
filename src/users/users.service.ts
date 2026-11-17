import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entites/user.entity.js';
import { ILike, Repository } from 'typeorm';
import { UpdateProfileDto } from './dto/update-profile.dto.js';
import { ChangePasswordDto } from './dto/change-password.dto.js';
import * as bcrypt from 'bcrypt';
import { ChangeRoleDto } from './dto/change-role.dto.js';
import { SearchUsersDto } from './dto/search-users.dto.js';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private readonly userRepo:Repository<User>){}

    async findone(id:number){
        const user = await this.userRepo.findOne({
            where:{id}
        });

        if(!user) {
            throw new NotFoundException("usr not found");
        }
        return user;
    }

    async UpdateProfile(userId:number,dto:UpdateProfileDto){
        const user = await this.userRepo.findOne({
            where:{id:userId}
        });

        if (!user) {
            throw new NotFoundException("usr not found");
        }

        if (dto.studentId && dto.studentId !== user.studentId) {
            const used = await this.userRepo.findOne({ where: { studentId: dto.studentId } });
            if (used) {
                throw new ConflictException("student id already exits");
            }
        }

        if (dto.name) user.name = dto.name;
        if (dto.studentId) user.studentId = dto.studentId;
        if (dto.department) user.department = dto.department;

        return this.userRepo.save(user);
    }

   
    async changePassword(userId: number, dto: ChangePasswordDto) {
        const user = await this.userRepo.findOne({
        where: { id: userId },
        select: { id: true, password: true },
        });

        if (!user) {
            throw new NotFoundException("user not found");
        }

        const isMatch = await bcrypt.compare(dto.oldPassword, user.password);
        if (!isMatch) {
        throw new UnauthorizedException("old password is wrong");
        }

        const newPass = await bcrypt.hash(dto.newPassword, 10);
        await this.userRepo.update(userId, { password: newPass });
        return { 
            message: "password changed"
        };
    }

    async changeRole(id: number, dto: ChangeRoleDto) {
        const user = await this.userRepo.findOne({
            where: { id }
        });

        if (!user) {
            throw new NotFoundException("user not found");
        }

        user.role = dto.role;
        return this.userRepo.save(user);
    }

    async remove(id: number) {
        const user = await this.userRepo.findOne({
            where: { id }
        });

        if (!user) {
            throw new NotFoundException("user not found");
        }

        await this.userRepo.remove(user);
        return { message: 'user deleted' };
    }

    async findAll(query: SearchUsersDto) {
        const page = query.page || 1;
        const limit = query.limit || 10;

        let where = {};
        if (query.search) {
            where = [
                { name: ILike(`%${query.search}%`) },
                { email: ILike(`%${query.search}%`) },
            ];
        }

        const [items, total] = await this.userRepo.findAndCount({
            where: where,
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });

        return { items, total, page, limit };
    }
    

}
