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
    const FULLURI = configService.get<string>('MONGODB_URI_DEV');
 

    const replica = configService.get<string>('DB_REPLICA'); // optional
    const authPart = username && password ? `${username}:${password}@` : '';
   //const url = "mongodb+srv://tayoraph_elor_tax_user:sb7t1AhDPTS3UGKd@taxcalculator.anrgx74.mongodb.net/";
   //mongodb+srv://tayoraph_elor_tax_user:sb7t1AhDPTS3UGKd@taxcalculator.anrgx74.mongodb.net/
    const url=  `mongodb+srv://${authPart}${host}?${replica}`; 
   // uri: `mongodb+srv://${authPart}${host}:${port}/${dbName}`, 
  console.log(url)
  console.log(FULLURI)

    return {
      uri: FULLURI, 
      dbName,
      useUnifiedTopology: true,
    };
  },
};
