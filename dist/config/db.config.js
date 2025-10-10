"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoDBConfig = void 0;
const config_1 = require("@nestjs/config");
exports.MongoDBConfig = {
    imports: [config_1.ConfigModule], // imports ConfigModule to access .env
    inject: [config_1.ConfigService],
    useFactory: async (configService) => {
        const username = configService.get('DB_USERNAME');
        const password = configService.get('DB_PASSWORD');
        const host = configService.get('DB_HOST');
        const port = configService.get('DB_PORT');
        const dbName = configService.get('DB_NAME');
        const FULLURI_DEV = configService.get('MONGODB_URI_DEV');
        const FULLURI_PD = configService.get('MONGODB_URI_PROD');
        const replica = configService.get('DB_REPLICA'); // optional
        const authPart = username && password ? `${username}:${password}@` : '';
        const url = `mongodb+srv://${authPart}${host}?${replica}`;
        return {
            uri: FULLURI_PD,
            dbName,
            useUnifiedTopology: true,
        };
    },
};
//# sourceMappingURL=db.config.js.map