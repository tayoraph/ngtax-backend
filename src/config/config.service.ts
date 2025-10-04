import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get dbHost(): string {
    return this.configService.get<string>('DB_HOST')|| 'localhost';
  }

  get dbPort(): number {
    return Number(this.configService.get<string>('DB_PORT'))!;
  }

  get dbUsername(): string {
    return this.configService.get<string>('DB_USERNAME')!;
  }

  get dbPassword(): string {
    return this.configService.get<string>('DB_PASSWORD')!;
  }

  get dbName(): string {
    return this.configService.get<string>('DB_NAME')!;
  }

  get jwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET')!;
  }

  get jwtExpiration(): string {
    return this.configService.get<string>('JWT_EXPIRATION')!;
  }
}
