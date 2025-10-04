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
exports.TaxService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const tax_schema_1 = require("../schema/tax.schema");
const file_logger_service_1 = require("../../common/logger/file-logger.service");
let TaxService = class TaxService {
    constructor(taxModel, logger) {
        this.taxModel = taxModel;
        this.logger = logger;
    }
    async findAll() {
        return this.taxModel.find().exec();
    }
    async calculateTax(dto) {
        this.logger.log(`Calculating tax for category ${dto.category} on amount ${dto.amount}`, 'TaxService');
        const tax = await this.taxModel.findOne({ name: dto.category }).exec();
        if (!tax)
            throw new common_1.NotFoundException('Tax category not found');
        const rate = tax.rate ?? 0;
        const calculated = dto.amount * rate;
        return {
            category: tax.name,
            amount: dto.amount,
            rate,
            tax: calculated,
            total: dto.amount + calculated,
        };
    }
    /**
     *
     * @param dto create tax category
     * @returns
     */
    async createCategory(dto) {
        this.logger.log(`creating new tax category`, 'TaxService');
        const newCategory = new this.taxModel(dto);
        return newCategory.save();
    }
    /**
     * @todo Update tax category
     */
    async updateCategory(id, dto) {
        this.logger.log(`Updating tax category by id ${id} and update request data ${dto}`, 'TaxService');
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.NotFoundException('Invalid tax category ID');
        }
        const updated = await this.taxModel.findByIdAndUpdate(id, dto, { new: true });
        if (!updated)
            throw new common_1.NotFoundException('Tax category not found');
        return updated;
    }
    /**
     * Delete a tax
     */
    // Inside TaxService
    async deleteCategory(id) {
        this.logger.log(`deleting tax category by id ${id}`, 'TaxService');
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.NotFoundException('Invalid tax category ID');
        }
        const deleted = await this.taxModel.findByIdAndDelete(id);
        if (!deleted)
            throw new common_1.NotFoundException('Tax category not found');
        return { message: 'Tax category deleted successfully' };
    }
};
exports.TaxService = TaxService;
exports.TaxService = TaxService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(tax_schema_1.TaxCategory.name)),
    __metadata("design:paramtypes", [mongoose_2.Model, file_logger_service_1.FileLogger])
], TaxService);
