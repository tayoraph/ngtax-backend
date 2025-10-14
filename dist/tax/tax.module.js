"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaxModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const tax_controller_1 = require("./controller/tax.controller");
const tax_schema_1 = require("./schema/tax.schema");
const tax_service_1 = require("./service/tax.service");
const tax_reform_schema_1 = require("./schema/tax-reform.schema");
const tax_reform_service_1 = require("./service/tax-reform.service");
const tax_reform_controller_1 = require("./controller/tax-reform.controller");
const loggerService_1 = require("../shared/logger/loggerService");
const tax_category_controller_1 = require("./controller/tax-category.controller");
const tax_category_service_1 = require("./service/tax-category.service");
let TaxModule = class TaxModule {
};
exports.TaxModule = TaxModule;
exports.TaxModule = TaxModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: tax_schema_1.TaxCategory.name, schema: tax_schema_1.TaxCategorySchema }, { name: tax_reform_schema_1.TaxReform.name, schema: tax_reform_schema_1.TaxReformSchema }])],
        controllers: [tax_controller_1.TaxController, tax_reform_controller_1.TaxReformController, tax_category_controller_1.TaxCategoryController],
        providers: [tax_service_1.TaxService, tax_reform_service_1.TaxReformService, loggerService_1.LoggerService, tax_category_service_1.TaxCategoryService],
        exports: [tax_reform_service_1.TaxReformService]
    })
], TaxModule);
//# sourceMappingURL=tax.module.js.map