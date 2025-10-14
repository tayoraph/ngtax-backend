import { MongooseModuleAsyncOptions } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const MongoDBConfig: MongooseModuleAsyncOptions = {
  imports: [ConfigModule], // imports ConfigModule to access .env
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    const username = configService.get<string>('DB_USERNAME');
    const password = configService.get<string>('DB_PASSWORD');
    const host = configService.get<string>('DB_HOST');
    const port = configService.get<string>('DB_PORT');
    const dbName = configService.get<string>('DB_NAME');
    const FULLURI_DEV = configService.get<string>('MONGODB_URI_DEV');
    const FULLURI_PD = configService.get<string>('MONGODB_URI_PROD');

 

    const replica = configService.get<string>('DB_REPLICA'); // optional
    const authPart = username && password ? `${username}:${password}@` : '';
    const url=  `mongodb+srv://${authPart}${host}?${replica}`; 
    
    return {
      uri: FULLURI_DEV, 
      dbName,
      useUnifiedTopology: true,
    };
  },
};
