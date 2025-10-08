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
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsertTaxReformDto = exports.TaxReformDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const individual_category_dto_1 = require("./individual-category.dto");
const business_category_dto_1 = require("./business-category.dto");
class TaxReformDto {
}
exports.TaxReformDto = TaxReformDto;
__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => individual_category_dto_1.IndividualCategoryDto),
    __metadata("design:type", Object)
], TaxReformDto.prototype, "Individuals", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => business_category_dto_1.BusinessCategoryDto),
    __metadata("design:type", Object)
], TaxReformDto.prototype, "Businesses", void 0);
class InsertTaxReformDto {
}
exports.InsertTaxReformDto = InsertTaxReformDto;
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => TaxReformDto),
    __metadata("design:type", TaxReformDto)
], InsertTaxReformDto.prototype, "NigeriaTaxReform2025", void 0);
//# sourceMappingURL=tax-reform.dto.js.map