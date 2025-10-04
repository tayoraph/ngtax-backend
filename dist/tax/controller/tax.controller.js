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
exports.TaxController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/jwt/auth.guard/jwt.auth.guard");
const calculate_tax_dto_1 = require("../schema/dto/calculate-tax.dto");
const tax_service_1 = require("../service/tax.service");
const create_tax_category_dto_1 = require("../dto/create-tax-category.dto");
const update_tax_category_dto_1 = require("../dto/update-tax-category.dto");
let TaxController = class TaxController {
    constructor(taxService) {
        this.taxService = taxService;
    }
    getAll() {
        return this.taxService.findAll();
    }
    calculate(dto) {
        return this.taxService.calculateTax(dto);
    }
    addCategory(dto) {
        return this.taxService.createCategory(dto);
    }
    /**
     * Update tax category
     * called by PATCH /tax/update-category/:id
     * sample request json payload
     *      {
            "name": "Personal Income Tax",
            "rate": 0.1
            }
     */
    updateCategory(id, dto) {
        return this.taxService.updateCategory(id, dto);
    }
    /**
     * Delete tax Category
     * called by DELETE /tax/delete-category/:id

     */
    deleteCategory(id) {
        return this.taxService.deleteCategory(id);
    }
};
exports.TaxController = TaxController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all tax categories' }),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TaxController.prototype, "getAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Calculate tax for a category' }),
    (0, common_1.Post)('calculate'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [calculate_tax_dto_1.CalculateTaxDto]),
    __metadata("design:returntype", void 0)
], TaxController.prototype, "calculate", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Add a new tax category' }),
    (0, common_1.Post)('add-category'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_tax_category_dto_1.CreateTaxCategoryDto]),
    __metadata("design:returntype", void 0)
], TaxController.prototype, "addCategory", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Update an existing tax category by ID' }),
    (0, common_1.Patch)('update-category/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_tax_category_dto_1.UpdateTaxCategoryDto]),
    __metadata("design:returntype", void 0)
], TaxController.prototype, "updateCategory", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a tax category by ID' }),
    (0, common_1.Delete)('delete-category/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TaxController.prototype, "deleteCategory", null);
exports.TaxController = TaxController = __decorate([
    (0, swagger_1.ApiTags)('Tax'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('tax'),
    __metadata("design:paramtypes", [tax_service_1.TaxService])
], TaxController);
