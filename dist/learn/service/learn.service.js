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
exports.LearnService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const learn_schema_1 = require("../schema/learn.schema");
let LearnService = class LearnService {
    constructor(learnModel) {
        this.learnModel = learnModel;
    }
    async create(createLearnDto) {
        const learn = new this.learnModel(createLearnDto);
        return learn.save();
    }
    async findAll() {
        return this.learnModel.find().exec();
    }
    async findOne(id) {
        const learn = await this.learnModel.findById(id).exec();
        if (!learn)
            throw new common_1.NotFoundException(`Learn item #${id} not found`);
        return learn;
    }
    async update(id, updateLearnDto) {
        const updated = await this.learnModel.findByIdAndUpdate(id, updateLearnDto, { new: true }).exec();
        if (!updated)
            throw new common_1.NotFoundException(`Learn item #${id} not found`);
        return updated;
    }
    async remove(id) {
        const deleted = await this.learnModel.findByIdAndDelete(id).exec();
        if (!deleted)
            throw new common_1.NotFoundException(`Learn item #${id} not found`);
        return deleted;
    }
};
exports.LearnService = LearnService;
exports.LearnService = LearnService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(learn_schema_1.Learn.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], LearnService);
//# sourceMappingURL=learn.service.js.map