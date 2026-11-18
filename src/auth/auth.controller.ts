import { Controller,Post,Body } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { ApiBody, ApiOperation } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({summary: 'Register new user'})
  @ApiBody({
    schema:{
      type:'object',
      properties:{
        name: { type: 'string', minLength: 2, example: 'Nihar Sarkar Tirtho' },
        email: { type: 'string', format: 'email', example: 'tirtho@gmail.com' },
        studentId: { type: 'string', example: '23-55293-3' },
        department: { type: 'string', example: 'CSE' },
        password: { type: 'string', minLength: 6, example: 'password123' },
      },
    },
  })
  @Post('register')
  register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @ApiOperation({summary: 'user login'})
  @ApiBody({
    schema:{
      type:'object',
      properties:{
        email: { type: 'string', format: 'email', example: 'tirtho@gmail.com' },
        password: { type: 'string', minLength: 6, example: 'password123' },
      },
    },
  })
  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @Post('logout')
  logout() {
    return this.authService.logout();
  }

}
