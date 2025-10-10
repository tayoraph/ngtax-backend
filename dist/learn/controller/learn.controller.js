"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LearnController = void 0;
const common_1 = require("@nestjs/common");
const create_learn_dto_1 = require("../dto/create-learn.dto");
const update_learn_dto_1 = require("../dto/update-learn.dto");
const learn_schema_1 = require("../schema/learn.schema");
const learn_service_1 = require("../service/learn.service");
const swagger_1 = require("@nestjs/swagger");
let LearnController = class LearnController {
    constructor(learnService) {
        this.learnService = learnService;
    }
    create(createLearnDto) {
        return this.learnService.create(createLearnDto);
    }
    findAll() {
        return this.learnService.findAll();
    }
    findOne(id) {
        return this.learnService.findOne(id);
    }
    update(id, updateLearnDto) {
        return this.learnService.update(id, updateLearnDto);
    }
    remove(id) {
        return this.learnService.remove(id);
    }
};
exports.LearnController = LearnController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Create a Learn item', type: learn_schema_1.Learn }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_learn_dto_1.CreateLearnDto]),
    __metadata("design:returntype", Promise)
], LearnController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LearnController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LearnController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_learn_dto_1.UpdateLearnDto]),
    __metadata("design:returntype", Promise)
], LearnController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LearnController.prototype, "remove", null);
exports.LearnController = LearnController = __decorate([
    (0, swagger_1.ApiTags)('Learn'),
    (0, common_1.Controller)('learn'),
    __metadata("design:paramtypes", [learn_service_1.LearnService])
], LearnController);
//# sourceMappingURL=learn.controller.js.map