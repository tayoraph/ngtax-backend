import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schema/user.schema';
import * as bcrypt from 'bcrypt';
import { AppConfigService } from '../../config/config.service';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>, 
private config: AppConfigService) {
    console.log('MongoDB Host:', this.config.dbHost);
    console.log('JWT Secret:', this.config.jwtSecret);
  }

  async create(user: { email: string; password: string; phone: string; tin: string }) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = new this.userModel({ ...user, password: hashedPassword });
    return newUser.save();
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async validateUser(email: string, password: string) {
    const user = await this.findByEmail(email);
    if (!user) return null;
    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch ? user : null;
  }
}
