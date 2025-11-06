import { NotFoundException } from '@nestjs/common';
import { stringSimilarity } from './string.similarity.utils';
import { formatCurrency } from './currency/currency.utils';

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
  fixedAssets?: number;
}

export function calculateTaxLogic({
  role,
  taxName,
  incomeOrTurnover,
  taxData,
  fixedAssets
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
            foundTax = details.TaxCategories?.find((t) => t.name === taxName) || null;
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

  // 🧩 Small Company Rule — applies to Company Income Tax (CIT) 
  if (foundTax.name === 'Company Income Tax (CIT)' && foundCategory === 'SmallCompany') {
    if ((foundCategoryType === 'Businesses' &&
          incomeOrTurnover < 50_000_000 &&
          fixedAssets !== undefined &&
          fixedAssets < 250_000_000)
      ) {
      return {
        'Tax Category': foundTax.name,
        'Rate (%)': foundTax.ratePercent,
        'Annual Income Or Turnover': formatCurrency(incomeOrTurnover),
        'Tax To Pay': 0,
        'Exempt': true,
        'Matched User Type': foundCategoryType,
        'Matched Category': 'Small Company',
        'Message': 'Small companies (turnover < ₦50M and fixed assets < ₦250M) are exempt from Company Income Tax.'
      };
    }
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
          'Annual Income Or Turnover': formatCurrency(incomeOrTurnover),
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
    const taxToPayMonthly = taxToPay / 12;

    return {
      'Message': `Progressive ${foundTax.name} calculated for '${closestRole}' (matched from '${role}').`,
      'Tax Category': foundTax.name,
      'Rate (%)': foundTax.ratePercent,
      'Annual Income Or Turnover': formatCurrency(incomeOrTurnover),
      'Tax To Pay': formatCurrency(Math.round(taxToPay)),
      'Expected Monthly Tax': formatCurrency(Math.round(taxToPayMonthly)),
      'Exempt': false,
      'Matched User Type': foundCategoryType,
      'Matched Category': foundCategory,
    };
  }


  // setting  found Category Type to large company if income or turnover is above 50 million and fixed asset is above 250 million for businesses
  if (
    (foundCategoryType === 'Businesses' &&
    incomeOrTurnover < 50_000_000 &&
    fixedAssets !== undefined &&
    fixedAssets < 250_000_000) 
   
  ) {
    foundCategory = 'Large Companies';
  }

  // 🧩 Flat Rate
  const taxToPay = Math.round((incomeOrTurnover * foundTax.ratePercent) / 100);
  const taxToPayMonthly = taxToPay / 12;

  return {
    'Message': `Flat ${foundTax.name} calculated for '${closestRole}' (matched from '${role}').`,
    'Tax Category': foundTax.name,
    'Rate (%)': foundTax.ratePercent,
    'Annual Income Or Turnover': formatCurrency(incomeOrTurnover),
    'Expected Annual Tax': formatCurrency(Math.round(taxToPay)),
    'Expected Monthly Tax': formatCurrency(Math.round(taxToPayMonthly)),
    'Exempt': false,
    'Matched User Type': foundCategoryType,
    'Matched Category': foundCategory,
  };
}



