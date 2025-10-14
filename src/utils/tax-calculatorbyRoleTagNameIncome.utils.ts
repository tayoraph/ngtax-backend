import { NotFoundException } from '@nestjs/common';
import { stringSimilarity } from './string.similarity.utils';

interface Role {
  title: string;
  description: string;
}

interface TaxDetail {
  name: string;
  ratePercent: number;
  exemptions?: any[];
  brackets?: any[];
}

interface TaxCategoryDetails {
  Roles: { title: string; description: string }[];
  TaxCategories: any[];
  SalaryRange?: string;
  TurnoverRange?: string;
  brackets?: { upTo?: number; above?: number; ratePercent: number }[];
  exemptions?: { type: string; threshold?: number; message?: string; exemptItems?: string[] }[];
  note?: string;
}


interface TaxCalculationInput {
  role: string;
  taxName: string;
  incomeOrTurnover: number;
  taxData: any[];
}

export function calculateTaxLogic({
  role,
  taxName,
  incomeOrTurnover,
  taxData,
}: TaxCalculationInput) {
  let foundCategoryType: string | null = null;
  let foundCategory: string | null = null;
  let foundTax: any = null;
  let closestRole: string | null = null;
  let bestMatchScore = 0;

  // 🔹 taxData is an array of MongoDB documents
  for (const doc of taxData) {
    // Each doc contains "Individuals" and/or "Businesses"
    for (const [entityType, categories] of Object.entries(doc)) {
      if (entityType === '_id' || typeof categories !== 'object' || !categories) continue;

      // 🔹 e.g. categories = { EntrepreneursSMEs: {...}, LargeCompanies: {...} }
      for (const [categoryName, details] of Object.entries(categories as Record<string, TaxCategoryDetails>)) {
        const roles = details.Roles || [];

        for (const roleObj of roles) {
          const similarity = stringSimilarity(role, roleObj.title);

          if (similarity > bestMatchScore) {
            bestMatchScore = similarity;
            closestRole = roleObj.title;
            foundCategoryType = entityType; // e.g. "Businesses" or "Individuals"
            foundCategory = categoryName;
            foundTax =
              details.TaxCategories?.find((t) => t.name === taxName) || null;
          }
        }
      }
    }
  }

  // 🧩 Handle not found
  if (!foundTax || bestMatchScore < 0.4) {
    throw new NotFoundException(
      `No matching tax found for role '${role}' and tax '${taxName}'.`
    );
  }

  // 🧩 Handle exemptions
  if (foundTax.exemptions?.length) {
    for (const ex of foundTax.exemptions) {
      if (
        (ex.type === 'incomeBelow' || ex.type === 'turnoverBelow') &&
        incomeOrTurnover < ex.threshold
      ) {
        return {
          'Tax Category': foundTax.name,
          'Rate (%)': foundTax.ratePercent,
          'Amount': incomeOrTurnover,
          'Tax To Pay': 0,
          'Exempt': true,
          'Matched User Type': foundCategoryType,
          'Matched Category': foundCategory,
          'Message': ex.message || 'Below exemption threshold.',
        };
      }
    }
  }

  // 🧩 Progressive Brackets
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
        if (remaining <= 0) break;
      } else if (bracket.above) {
        totalTax += (remaining * bracket.ratePercent) / 100;
        break;
      }
    }

    const taxToPay = Math.round(totalTax);
    const taxToPayMonthly = taxToPay/12;

    return {
      'Tax Category': foundTax.name,
      'Rate (%)': foundTax.ratePercent,
       'Amount': incomeOrTurnover,
      'Tax To Pay': Math.round(taxToPay),
      'Expected Monthly Tax':Math.round(taxToPayMonthly),
       'Exempt': false,
      'Matched User Type': foundCategoryType,
      'Matched Category': foundCategory,
       'Message': `Progressive ${foundTax.name} calculated for '${closestRole}' (matched from '${role}').`,
    };
  }

  // 🧩 Flat Rate
  const taxToPay = Math.round((incomeOrTurnover * foundTax.ratePercent) / 100);
  const taxToPayMonthly = taxToPay/12;

  return {
    'Tax Category': foundTax.name,
    'Rate (%)': foundTax.ratePercent,
    'Amount': incomeOrTurnover,
    'Expected Annual Tax': Math.round(taxToPay),
    'Expected Monthly Tax':Math.round(taxToPayMonthly),
    'Exempt': false,
    'Matched User Type': foundCategoryType,
    'Matched Category': foundCategory,
     'Message': `Flat ${foundTax.name} calculated for '${closestRole}' (matched from '${role}').`,
  };
}


