import { ApiTags, ApiOperation, ApiProperty } from '@nestjs/swagger';
import { Controller, Post, Body } from '@nestjs/common';
import { LoginDto } from '../dto/login/dto';
import { SignupDto } from '../dto/login/signup.dto';
import { AuthService } from '../service/auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Login user and get JWT token' })
  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }

  @ApiOperation({ summary: 'Signup new user and get JWT token' })
  @Post('signup')
  signup(@Body() body: SignupDto) {
    return this.authService.signup(body);
  }
}
