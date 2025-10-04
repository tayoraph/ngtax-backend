import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/service/user.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async signup(user: { email: string; password: string; phone: string; tin: string }) {
    const newUser = await this.usersService.create(user);
    const payload = { email: newUser.email, sub: newUser._id };
    return { access_token: this.jwtService.sign(payload) };
  }

  async login(email: string, password: string) {
    const user = await this.usersService.validateUser(email, password);
    if (!user) return { error: 'Invalid credentials' };
    const payload = { email: user.email, sub: user._id };
    return { access_token: this.jwtService.sign(payload) };
  }
}
