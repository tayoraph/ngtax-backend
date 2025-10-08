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
exports.BusinessCategorySchema = exports.BusinessCategory = exports.IndividualCategorySchema = exports.IndividualCategory = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const role_schema_1 = require("./role.schema");
const tax_schema_1 = require("./tax.schema");
let IndividualCategory = class IndividualCategory {
};
exports.IndividualCategory = IndividualCategory;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], IndividualCategory.prototype, "SalaryRange", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [tax_schema_1.TaxCategorySchema], default: [] }),
    __metadata("design:type", Array)
], IndividualCategory.prototype, "TaxCategories", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [role_schema_1.RoleSchema], default: [] }),
    __metadata("design:type", Array)
], IndividualCategory.prototype, "Roles", void 0);
exports.IndividualCategory = IndividualCategory = __decorate([
    (0, mongoose_1.Schema)()
], IndividualCategory);
exports.IndividualCategorySchema = mongoose_1.SchemaFactory.createForClass(IndividualCategory);
let BusinessCategory = class BusinessCategory {
};
exports.BusinessCategory = BusinessCategory;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], BusinessCategory.prototype, "TurnoverRange", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [tax_schema_1.TaxCategorySchema], default: [] }),
    __metadata("design:type", Array)
], BusinessCategory.prototype, "TaxCategories", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [role_schema_1.RoleSchema], default: [] }),
    __metadata("design:type", Array)
], BusinessCategory.prototype, "Roles", void 0);
exports.BusinessCategory = BusinessCategory = __decorate([
    (0, mongoose_1.Schema)()
], BusinessCategory);
exports.BusinessCategorySchema = mongoose_1.SchemaFactory.createForClass(BusinessCategory);
//# sourceMappingURL=category.schema.js.map