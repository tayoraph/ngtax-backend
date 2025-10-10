"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LearnModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const learn_schema_1 = require("./schema/learn.schema");
const learn_controller_1 = require("./controller/learn.controller");
const learn_service_1 = require("./service/learn.service");
let LearnModule = class LearnModule {
};
exports.LearnModule = LearnModule;
exports.LearnModule = LearnModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: learn_schema_1.Learn.name, schema: learn_schema_1.LearnSchema }])],
        controllers: [learn_controller_1.LearnController],
        providers: [learn_service_1.LearnService],
    })
], LearnModule);
//# sourceMappingURL=learn.module.js.map