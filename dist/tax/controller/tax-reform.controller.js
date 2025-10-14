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
exports.TaxReformController = void 0;
const common_1 = require("@nestjs/common");
const tax_reform_dto_1 = require("../dto/dto/tax-reform.dto");
const tax_reform_service_1 = require("../service/tax-reform.service");
const swagger_1 = require("@nestjs/swagger");
const calculateTaxByCategory_dto_1 = require("../dto/dto/calculateTaxByCategory.dto");
const taxbyTaxnameRoleAndIncome_dto_1 = require("../dto/dto/taxbyTaxnameRoleAndIncome.dto");
let TaxReformController = class TaxReformController {
    constructor(service) {
        this.service = service;
    }
    async insert(dto) {
        return this.service.insertTaxData(dto);
    }
    async getAll() {
        let tax = this.service.getAll();
        return tax;
    }
    getByCategory(category) {
        return this.service.getByCategory(category);
    }
    getByRole(role) {
        return this.service.getByRole(role);
    }
    getByTaxCategory(taxCategory) {
        return this.service.getByTaxCategory(taxCategory);
    }
    //#region Get role array
    async getRoles() {
        return this.service.getAllRoles();
    }
    //#endregion
    //#region  get Tax By Role And Income
    async getTaxByRoleAndIncome(role, incomeStr) {
        const income = parseInt(incomeStr, 10);
        if (!role || isNaN(income)) {
            throw new common_1.BadRequestException('Provide valid "role" and numeric "income"');
        }
        return this.service.calculateTaxByRoleAndIncome(role, income);
    }
    //#endregion
    //#region  calculate exact tax to bepaid and not an estimate 
    // @Post('calculate')
    // async calculateTax(@Body() calculateTaxDto: CalculateTaxDto) {
    //   const { roleTitle, amount } = calculateTaxDto;
    //   return this.taxService.calculateTaxExactMatch(roleTitle, amount);
    // }
    //#endregion
    //#region calculate Tax By Tax Category 
    //@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
    async calculate(dto) {
        return this.service.calculateByTaxCategory(dto);
    }
    //#endregion
    //#region calculate tax by role, income and taxName 
    async calculateTax(dto) {
        return await this.service.calculateTaxByRoleAndTaxnameAndIncome(dto);
    }
};
exports.TaxReformController = TaxReformController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [tax_reform_dto_1.InsertTaxReformDto]),
    __metadata("design:returntype", Promise)
], TaxReformController.prototype, "insert", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TaxReformController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)('category/:category'),
    __param(0, (0, common_1.Param)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TaxReformController.prototype, "getByCategory", null);
__decorate([
    (0, common_1.Get)('role/:role'),
    __param(0, (0, common_1.Param)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TaxReformController.prototype, "getByRole", null);
__decorate([
    (0, common_1.Get)('tax/:taxCategory'),
    __param(0, (0, common_1.Param)('taxCategory')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TaxReformController.prototype, "getByTaxCategory", null);
__decorate([
    (0, common_1.Get)('role'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TaxReformController.prototype, "getRoles", null);
__decorate([
    (0, common_1.Get)('getTaxByRoleAndIncome'),
    __param(0, (0, common_1.Query)('role')),
    __param(1, (0, common_1.Query)('income')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TaxReformController.prototype, "getTaxByRoleAndIncome", null);
__decorate([
    (0, common_1.Post)('calculateByTaxCategory')
    //@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
    ,
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [calculateTaxByCategory_dto_1.CalculateTaxByCategoryDto]),
    __metadata("design:returntype", Promise)
], TaxReformController.prototype, "calculate", null);
__decorate([
    (0, common_1.Post)('TaxCalculationByTaxNameRoleAndIncomeDto'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [taxbyTaxnameRoleAndIncome_dto_1.TaxCalculationByTaxNameRoleAndIncomeDto]),
    __metadata("design:returntype", Promise)
], TaxReformController.prototype, "calculateTax", null);
exports.TaxReformController = TaxReformController = __decorate([
    (0, swagger_1.ApiTags)('Tax'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('taxreform'),
    __metadata("design:paramtypes", [tax_reform_service_1.TaxReformService])
], TaxReformController);
//# sourceMappingURL=tax-reform.controller.js.map