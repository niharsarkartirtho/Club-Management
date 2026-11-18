import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entites/user.entity.js';
import { JwtStrategy } from './jwt-auth/jwt.strategy.js';
import { PassportModule } from '@nestjs/passport';
import {JwtModule} from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { filepathToName } from 'typeorm/util/PathUtils.js';

@Module({
  imports:[TypeOrmModule.forFeature([User]),
  PassportModule.register({defaultStrategy:'jwt'}),
  JwtModule.registerAsync({
    global:true,
    inject:[ConfigService],
    useFactory:(configService:ConfigService)=>{
      const secret = configService.get<string>('JWT_SECRET');
      
      if (!secret) {
        throw new Error('JWT_SECRET is not configured');
      }
      return{
        secret,
        signOptions:{expiresIn:configService.get('JWT_EXPIRES_IN') || '15m'},
      };
    },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy],
})
export class AuthModule {}
