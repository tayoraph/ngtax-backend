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
exports.TaxReformService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const tax_reform_schema_1 = require("../schema/tax-reform.schema");
const loggerService_1 = require("../../shared/logger/loggerService");
let TaxReformService = class TaxReformService {
    constructor(taxReformModel, logger) {
        this.taxReformModel = taxReformModel;
        this.logger = logger;
    }
    // -----------------------
    // INSERT DATA
    // -----------------------
    async insertTaxData(data) {
        const doc = new this.taxReformModel({
            individuals: data.NigeriaTaxReform2025.Individuals,
            businesses: data.NigeriaTaxReform2025.Businesses,
        });
        return doc.save();
    }
    // -----------------------
    // GET ALL
    // -----------------------
    async getAll() {
        return this.taxReformModel.find().exec();
    }
    // -----------------------
    // GET BY CATEGORY
    // -----------------------
    async getByCategory(category) {
        const doc = await this.taxReformModel.findOne().lean();
        if (!doc)
            throw new common_1.NotFoundException('Tax data not found');
        const individualMatch = doc.Individuals?.[category];
        const businessMatch = doc.Businesses?.[category];
        if (!individualMatch && !businessMatch)
            throw new common_1.NotFoundException(`No category found for "${category}"`);
        return individualMatch || businessMatch;
    }
    // -----------------------
    // GET BY ROLE
    // -----------------------
    async getByRole(roleTitle) {
        const doc = await this.taxReformModel.findOne().lean();
        if (!doc)
            throw new common_1.NotFoundException('Tax data not found');
        const searchRole = roleTitle.toLowerCase();
        // Search through Individuals
        for (const [category, data] of Object.entries(doc.Individuals || {})) {
            const found = data.Roles.find((r) => r.title.toLowerCase() === searchRole);
            if (found) {
                return {
                    entityType: 'Individuals',
                    category,
                    ...found,
                    taxCategories: data.TaxCategories,
                    salaryRange: data.SalaryRange,
                };
            }
        }
        // Search through Businesses
        for (const [category, data] of Object.entries(doc.Businesses || {})) {
            const found = data.Roles.find((r) => r.title.toLowerCase() === searchRole);
            if (found) {
                return {
                    entityType: 'Businesses',
                    category,
                    ...found,
                    taxCategories: data.TaxCategories,
                    turnoverRange: data.TurnoverRange,
                };
            }
        }
        throw new common_1.NotFoundException(`Role "${roleTitle}" not found`);
    }
    // -----------------------
    // GET BY TAX CATEGORY (Optional)
    // -----------------------
    async getByTaxCategory(taxCategory) {
        const doc = await this.taxReformModel.findOne().lean();
        if (!doc)
            throw new common_1.NotFoundException('Tax data not found');
        const result = [];
        for (const [cat, data] of Object.entries(doc.Individuals || {})) {
            if (data.TaxCategories.some((tax) => tax.toLowerCase() === taxCategory.toLowerCase())) {
                result.push({ entityType: 'Individuals', category: cat, ...data });
            }
        }
        for (const [cat, data] of Object.entries(doc.Businesses || {})) {
            if (data.TaxCategories.some((tax) => tax.toLowerCase() === taxCategory.toLowerCase())) {
                result.push({ entityType: 'Businesses', category: cat, ...data });
            }
        }
        if (result.length === 0)
            throw new common_1.NotFoundException(`No records found for tax "${taxCategory}"`);
        return result;
    }
    //#region Get roles 
    // get roles 
    async getAllRoles() {
        this.logger.log(`[${new Date().toISOString()}] get roles request entered service layer`);
        const doc = await this.taxReformModel.findOne().lean();
        this.logger.log(`[${new Date().toISOString()}] get role request data is ${doc}`);
        if (!doc)
            return [];
        const allRoles = [];
        // Extract roles from individuals
        if (doc.Individuals && typeof doc.Individuals === 'object') {
            Object.values(doc.Individuals).forEach((category) => {
                if (Array.isArray(category.Roles)) {
                    allRoles.push(...category.Roles);
                }
            });
        }
        // Extract Roles from businesses
        if (doc.Businesses && typeof doc.Businesses === 'object') {
            Object.values(doc.Businesses).forEach((category) => {
                if (Array.isArray(category.Roles)) {
                    allRoles.push(...category.Roles);
                }
            });
        }
        return allRoles;
    }
    //#endregion
    //#region calculate Tax By Role And Income
    // estimate roles 
    // async calculateTaxByRoleAndIncome(roleTitle: string, income: number): Promise<any> {
    //   const taxData = await this.taxReformModel.findOne().lean();
    //   // 1. Check Individual Roles
    //   const individuals = taxData?.Individuals ?? {};
    //   for (const categoryName in individuals) {
    //     const category = individuals[categoryName];
    //     const matchedRole = category.Roles.find((role: any) => role.title === roleTitle);
    //     if (matchedRole) {
    //       // Role found, check income range
    //       if (this.inRange(income, category.SalaryRange)) {
    //         return {
    //           categoryType: 'individual',
    //           categoryName,
    //           role: matchedRole.title,
    //           description: matchedRole.description,
    //           salaryRange: category.SalaryRange,
    //           taxCategories: category.TaxCategories,
    //           estimatedTax: this.estimateTax(income, category.TaxCategories),
    //         };
    //       } else {
    //         // Role found but income not in range - return immediately
    //         return {
    //           error: `Yearly Income of ${income} is exempted salary range for role "${roleTitle}"`,
    //           categoryType: 'individual',
    //           categoryName,
    //           salaryRange: category.SalaryRange,
    //         };
    //       }
    //     }
    //   }
    //   // 2. Check Business Roles
    //   const businesses = taxData?.Businesses ?? {};
    //   for (const categoryName in businesses) {
    //     const category = businesses[categoryName];
    //     const matchedRole = category.Roles.find(role => role.title === roleTitle);
    //     if (matchedRole) {
    //       // Role found, check turnover range
    //       if (this.inRange(income, category.TurnoverRange)) {
    //         return {
    //           categoryType: 'business',
    //           categoryName,
    //           role: matchedRole.title,
    //           description: matchedRole.description,
    //           turnoverRange: category.TurnoverRange,
    //           taxCategories: category.TaxCategories,
    //           estimatedTax: this.estimateTax(income, category.TaxCategories),
    //         };
    //       } else {
    //         // Role found but turnover not in range - return immediately
    //         return {
    //           error: `Turnover ${income} is not in the turnover range for role "${roleTitle}"`,
    //           categoryType: 'business',
    //           categoryName,
    //           turnoverRange: category.TurnoverRange,
    //         };
    //       }
    //     }
    //   }
    //   // If no matching role found at all
    //   throw new NotFoundException(`Role "${roleTitle}" not found`);
    // }
    // private inRange(value: number, rangeStr: string): boolean {
    //   const [minStr, maxStr] = rangeStr
    //     .replace(/₦| per year|\+/g, '')
    //     .split('–')
    //     .map(s => s.trim().replace(/,/g, ''));
    //   const min = parseInt(minStr, 10);
    //   const max = maxStr ? parseInt(maxStr, 10) : Number.MAX_SAFE_INTEGER;
    //   return value >= min && value <= max; //value >= min will be false if value is smaller than the min threshold.
    // }
    formatCurrency(amount) {
        return `₦${amount.toLocaleString('en-NG', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        })}`;
    }
    // async calculateTaxByRoleAndIncome(roleTitle: string, income: number): Promise<any> {
    //   const taxData = await this.taxReformModel.findOne().lean();
    //   if (!taxData) {
    //    console.log('Tax data not found in the data');
    //     throw new NotFoundException('Tax data not found in the data');
    //   }
    //   // Helper to format currency as ₦1,000,000
    //   const formatCurrency = (value: number): string =>
    //     `₦${value.toLocaleString('en-NG', {
    //       minimumFractionDigits: 0,
    //       maximumFractionDigits: 0,
    //     })}`;
    //   // 1. Check Individuals
    //   const individuals = taxData.Individuals ?? {};
    //   for (const categoryName in individuals) {
    //     const category = individuals[categoryName];
    //     const matchedRole = category.Roles.find((role: any) => role.title === roleTitle);
    //     if (matchedRole) {
    //       const rangeCheck = this.inRange(income, category.SalaryRange);
    //       if (rangeCheck === true) {
    //            const estimatedTax = this.estimateTax(income, category.TaxCategories);
    //         const monthlyTax = estimatedTax / 12;
    //         return {
    //           categoryType: 'individual',
    //           categoryName,
    //           role: matchedRole.title,
    //           description: matchedRole.description,
    //           salaryRange: category.SalaryRange,
    //           taxCategories: category.TaxCategories,
    //           estimatedTax,               // yearly tax
    //           monthlyTax: Number(monthlyTax.toFixed(2)),
    //         };
    //       }
    //       // Below range (exempted)
    //       if (rangeCheck === false) {
    //         return {
    //           error: `Your income of ${formatCurrency(income)} is **below** the salary range required for role "${roleTitle}".`,
    //           categoryType: 'individual',
    //           categoryName,
    //           salaryRange: category.SalaryRange,
    //         };
    //       }
    //       // Other issues (e.g., above range or invalid format)
    //       return {
    //         error: rangeCheck,
    //         categoryType: 'individual',
    //         categoryName,
    //         salaryRange: category.SalaryRange,
    //       };
    //     }
    //   }
    //   // 2. Check Businesses
    //   const businesses = taxData.Businesses ?? {};
    //   for (const categoryName in businesses) {
    //     const category = businesses[categoryName];
    //     const matchedRole = category.Roles.find((role: any) => role.title === roleTitle);
    //     if (matchedRole) {
    //       const rangeCheck = this.inRange(income, category.TurnoverRange);
    //       const estimatedTax = this.estimateTax(income, category.TaxCategories);
    //       const monthlyTax = estimatedTax / 12;
    //       if (rangeCheck === true) {
    //         return {
    //           categoryType: 'business',
    //           categoryName,
    //           role: matchedRole.title,
    //           description: matchedRole.description,
    //           turnoverRange: category.TurnoverRange,
    //           taxCategories: category.TaxCategories,
    //           estimatedTax,                 // yearly tax
    //           monthlyTax: Number(monthlyTax.toFixed(2)), 
    //         };
    //       }
    //       if (rangeCheck === false) {
    //         return {
    //           error: `You are **exempted** from paying tax as your turnover of ${formatCurrency(income)} is **below** the range required for role "${roleTitle}".`,
    //           categoryType: 'business',
    //           categoryName,
    //           turnoverRange: category.TurnoverRange,
    //         };
    //       }
    //       return {
    //         error: rangeCheck,
    //         categoryType: 'business',
    //         categoryName,
    //         turnoverRange: category.TurnoverRange,
    //       };
    //     }
    //   }
    //   // 3. No role matched
    //   console.log(`Role "${roleTitle}" not found in any tax category.`);
    //   throw new NotFoundException(`Role "${roleTitle}" not found in any tax category.`);
    // }
    // checking in  range
    inRange(value, rangeStr) {
        const [minStr, maxStr] = rangeStr
            .replace(/₦| per year|\+/g, '')
            .split('–')
            .map(s => s.trim().replace(/,/g, ''));
        const min = parseInt(minStr, 10);
        const max = maxStr ? parseInt(maxStr, 10) : Number.MAX_SAFE_INTEGER;
        if (isNaN(min))
            return 'Invalid salary/turnover range';
        if (isNaN(max))
            return 'Invalid salary/turnover range';
        if (value < min)
            return false; // Exempt case
        if (value > max) {
            return `Provided income ${this.formatCurrency(value)} exceeds allowed maximum of ${this.formatCurrency(max)}.`;
        }
        return true;
    }
    estimateTax(income, taxCategories) {
        let tax = 0;
        for (const taxType of taxCategories) {
            if (taxType.includes('Personal Income Tax (PIT)')) {
                tax += income * 0.1;
            }
            if (taxType.includes('Companies Income Tax (CIT)')) {
                tax += income * 0.2;
            }
            if (taxType.includes('Value Added Tax (VAT)')) {
                tax += income * 0.075;
            }
            if (taxType.includes('Capital Gains Tax (CGT)')) {
                tax += income * 0.05;
            }
            if (taxType.includes('15% Minimum Effective Tax Rate')) {
                tax += income * 0.15;
            }
        }
        return Math.round(tax);
    }
    //#endregion
    //#region  calcularing with exemptions 
    async calculateTaxByRoleAndIncome(roleTitle, income) {
        const taxData = await this.taxReformModel.findOne().lean();
        if (!taxData) {
            throw new common_1.NotFoundException('Tax data not found');
        }
        const formatCurrency = (value) => `₦${value.toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
        const parseRange = (rangeStr) => {
            const numbers = rangeStr.match(/[\d,]+/g)?.map(n => Number(n.replace(/,/g, '')));
            if (!numbers || numbers.length < 1)
                return [0, Infinity];
            return [numbers[0], numbers[1] || Infinity];
        };
        const checkExemptions = (taxCategory, amount) => {
            if (!taxCategory.exemptions)
                return false;
            for (const exemption of taxCategory.exemptions) {
                switch (exemption.type) {
                    case 'incomeBelow':
                    case 'turnoverBelow':
                    case 'gainsBelow':
                        if (amount <= exemption.threshold)
                            return true;
                        break;
                }
            }
            return false;
        };
        const calculateCategoryTax = (taxCategory, amount) => {
            if (checkExemptions(taxCategory, amount))
                return 0;
            return (amount * (taxCategory.ratePercent || 0)) / 100;
        };
        // Handle individuals
        const individuals = taxData.Individuals ?? {};
        for (const categoryName in individuals) {
            const category = individuals[categoryName];
            const matchedRole = category.Roles.find((role) => role.title === roleTitle);
            if (matchedRole) {
                const [minSalary, maxSalary] = parseRange(category.SalaryRange);
                if (income < minSalary) {
                    return {
                        error: `Your income of ${formatCurrency(income)} is below the salary range for role "${roleTitle}".`,
                        categoryType: 'individual',
                        categoryName,
                        salaryRange: category.SalaryRange
                    };
                }
                if (income > maxSalary && maxSalary !== Infinity) {
                    return {
                        error: `Your income of ${formatCurrency(income)} is above the salary range for role "${roleTitle}".`,
                        categoryType: 'individual',
                        categoryName,
                        salaryRange: category.SalaryRange
                    };
                }
                let totalTax = 0;
                const taxCategories = [];
                const exemptedTaxCategories = [];
                for (const taxCategory of category.TaxCategories) {
                    const isExempted = checkExemptions(taxCategory, income);
                    const taxAmount = calculateCategoryTax(taxCategory, income);
                    if (isExempted) {
                        exemptedTaxCategories.push(taxCategory.name);
                    }
                    else {
                        taxCategories.push(taxCategory.name);
                    }
                    totalTax += taxAmount;
                }
                //**** */ to add rate to the tax category 
                //  for (const taxCategory of category.TaxCategories) {
                //   const isExempted = checkExemptions(taxCategory, income);
                //   const taxAmount = calculateCategoryTax(taxCategory, income);
                //   const taxData = { name: taxCategory.name, rate: taxCategory.rate || 0 };
                //   if (isExempted) {
                //     exemptedTaxCategories.push(taxData);
                //   } else {
                //     taxCategories.push(taxData);
                //   }
                //   totalTax += taxAmount;
                // }
                let resp = {
                    categoryType: 'individual',
                    categoryName,
                    role: matchedRole.title,
                    description: matchedRole.description,
                    salaryRange: category.SalaryRange,
                    taxCategories,
                    exemptedTaxCategories,
                    estimatedTax: totalTax,
                    monthlyTax: Number((totalTax / 12).toFixed(2))
                };
                console.log(resp);
                return resp;
            }
        }
        // Handle businesses
        const businesses = taxData.Businesses ?? {};
        for (const categoryName in businesses) {
            const category = businesses[categoryName];
            const matchedRole = category.Roles.find((role) => role.title === roleTitle);
            if (matchedRole) {
                const [minTurnover, maxTurnover] = parseRange(category.TurnoverRange);
                if (income < minTurnover) {
                    return {
                        error: `Your turnover of ${formatCurrency(income)} is below the range for role "${roleTitle}".`,
                        categoryType: 'business',
                        categoryName,
                        turnoverRange: category.TurnoverRange
                    };
                }
                if (income > maxTurnover && maxTurnover !== Infinity) {
                    return {
                        error: `Your turnover of ${formatCurrency(income)} is above the range for role "${roleTitle}".`,
                        categoryType: 'business',
                        categoryName,
                        turnoverRange: category.TurnoverRange
                    };
                }
                let totalTax = 0;
                const taxCategories = [];
                const exemptedTaxCategories = [];
                for (const taxCategory of category.TaxCategories) {
                    const isExempted = checkExemptions(taxCategory, income);
                    const taxAmount = calculateCategoryTax(taxCategory, income);
                    if (isExempted) {
                        exemptedTaxCategories.push(taxCategory.name);
                    }
                    else {
                        taxCategories.push(taxCategory.name);
                    }
                    totalTax += taxAmount;
                }
                return {
                    categoryType: 'business',
                    categoryName,
                    role: matchedRole.title,
                    description: matchedRole.description,
                    turnoverRange: category.TurnoverRange,
                    taxCategories,
                    exemptedTaxCategories,
                    estimatedTax: totalTax,
                    monthlyTax: Number((totalTax / 12).toFixed(2))
                };
            }
        }
        throw new common_1.NotFoundException(`Role "${roleTitle}" not found in any tax category.`);
    }
};
exports.TaxReformService = TaxReformService;
exports.TaxReformService = TaxReformService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(tax_reform_schema_1.TaxReform.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        loggerService_1.LoggerService])
], TaxReformService);
//# sourceMappingURL=tax-reform.service.js.map