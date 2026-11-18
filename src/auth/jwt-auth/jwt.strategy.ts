import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthUser } from "./jwt-auth.guard.js";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(configService: ConfigService) {
        const secret_token = configService.get<string>('JWT_SECRET');
        if (!secret_token) {
            throw new Error("jwt secret is not configured");
        }

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: secret_token,
        });
    }

    validate(payload: AuthUser) {
        return {
            sub: payload.sub,
            email: payload.email,
            role: payload.role,
        };
    }
}