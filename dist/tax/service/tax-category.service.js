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
exports.TaxCategoryService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const tax_schema_1 = require("../schema/tax.schema");
let TaxCategoryService = class TaxCategoryService {
    constructor(taxCategoryModel) {
        this.taxCategoryModel = taxCategoryModel;
    }
    async findAll() {
        //    this.logger.log(`[${new Date().toISOString()}] get rall categories`);
        return this.taxCategoryModel.find().exec();
    }
    async findByCategoryType(categoryType) {
        // this.logger.log(`[${new Date().toISOString()}] get by  categories`);
        return this.taxCategoryModel.find({ categoryType }).exec();
    }
    async create(taxCategory) {
        // this.logger.log(`[${new Date().toISOString()}] create tax  category`);
        const created = new this.taxCategoryModel(taxCategory);
        return created.save();
    }
};
exports.TaxCategoryService = TaxCategoryService;
exports.TaxCategoryService = TaxCategoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(tax_schema_1.TaxCategory.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], TaxCategoryService);
//# sourceMappingURL=tax-category.service.js.map