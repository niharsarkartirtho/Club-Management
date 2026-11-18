import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

export type AuthUser = {
    sub:number;
    email:string;
    role:string;
};

export type AuthRequest ={ user:AuthUser;};

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt'){}