"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const auth_module_1 = require("./auth/auth.module");
const tax_module_1 = require("./tax/tax.module");
const file_logger_service_1 = require("./common/logger/file-logger.service");
const logger_module_1 = require("./common/logger/logger.module");
const config_module_1 = require("./config/config.module");
const db_config_1 = require("./config/db.config");
const learn_module_1 = require("./learn/learn.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_module_1.AppConfigModule, // Import global config
            //MongooseModule.forRoot(url),
            mongoose_1.MongooseModule.forRootAsync(db_config_1.MongoDBConfig),
            logger_module_1.LoggerModule, // import global module **once** here
            auth_module_1.AuthModule,
            tax_module_1.TaxModule,
            learn_module_1.LearnModule,
        ],
        providers: [
            {
                provide: common_1.Logger,
                useClass: file_logger_service_1.FileLogger, // Use custom file logger globally
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map