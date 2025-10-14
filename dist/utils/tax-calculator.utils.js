"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateTaxLogic = calculateTaxLogic;
const common_1 = require("@nestjs/common");
const string_similarity_utils_1 = require("./string.similarity.utils");
function calculateTaxLogic({ role, taxName, incomeOrTurnover, taxData, }) {
    let foundCategoryType = null;
    let foundCategory = null;
    let foundTax = null;
    let closestRole = null;
    let bestMatchScore = 0;
    // 🔹 Loop through category types and their categories
    for (const [categoryType, categories] of Object.entries(taxData)) {
        for (const [categoryName, details] of Object.entries(categories)) {
            const detailsTyped = details; // type assertion
            const roles = detailsTyped.Roles || [];
            for (const r of roles) {
                const sim = (0, string_similarity_utils_1.stringSimilarity)(role, r.title);
                if (sim > bestMatchScore) {
                    bestMatchScore = sim;
                    closestRole = r.title;
                    foundCategoryType = categoryType;
                    foundCategory = categoryName;
                    foundTax = detailsTyped.TaxCategories?.find((t) => t.name === taxName) || null;
                }
            }
        }
    }
    if (!foundTax || bestMatchScore < 0.4)
        throw new common_1.NotFoundException(`No matching tax found for role '${role}' and tax '${taxName}'.`);
    // 🔹 Handle exemptions
    if (foundTax.exemptions?.length) {
        for (const ex of foundTax.exemptions) {
            if ((ex.type === 'incomeBelow' || ex.type === 'turnoverBelow') &&
                incomeOrTurnover < ex.threshold) {
                return {
                    categoryType: foundCategoryType,
                    category: foundCategory,
                    role: closestRole,
                    taxName,
                    taxPayable: 0,
                    message: ex.message || 'Below exemption threshold.',
                };
            }
        }
    }
    // 🔹 Progressive brackets
    if (foundTax.brackets?.length) {
        let remaining = incomeOrTurnover;
        let totalTax = 0;
        let lastLimit = 0;
        for (const bracket of foundTax.brackets) {
            if (bracket.upTo) {
                const taxable = Math.min(remaining, bracket.upTo - lastLimit);
                totalTax += (taxable * bracket.ratePercent) / 100;
                remaining -= taxable;
                lastLimit = bracket.upTo;
                if (remaining <= 0)
                    break;
            }
            else if (bracket.above) {
                totalTax += (remaining * bracket.ratePercent) / 100;
                break;
            }
        }
        return {
            taxName: foundTax.name,
            ratePercent: foundTax.ratePercent,
            amount: incomeOrTurnover,
            taxToPay: Math.round(totalTax),
            exempt: false, // set to true if an exemption applies
            matchedEntityType: foundCategoryType,
            matchedCategory: foundCategory,
            role: closestRole,
            message: `Progressive ${foundTax.name} calculated for '${closestRole}' (matched from '${role}').`,
        };
    }
    // 🔹 Flat rate fallback
    const flatTax = (incomeOrTurnover * foundTax.ratePercent) / 100;
    return {
        taxName: foundTax.name,
        ratePercent: foundTax.ratePercent,
        amount: incomeOrTurnover,
        taxToPay: Math.round(flatTax),
        exempt: false, // set to true if an exemption applies
        matchedEntityType: foundCategoryType,
        matchedCategory: foundCategory,
        role: closestRole,
        message: `Flat ${foundTax.name} calculated for '${closestRole}' (matched from '${role}').`,
    };
}
//# sourceMappingURL=tax-calculator.utils.js.map