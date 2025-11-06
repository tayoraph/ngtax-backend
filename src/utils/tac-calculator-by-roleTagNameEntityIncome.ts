import { NotFoundException } from '@nestjs/common';
import { stringSimilarity } from './string.similarity.utils';
import { TaxCalculationByTagnameRoleaEntityndIncomeInput } from '../tax/dto/dto/calcuatetaxByTagnameRoleIncomeAndEntity.dto';
import { formatCurrency } from './currency/currency.utils';

interface TaxCalculationInput {
  role: string;
  taxName: string;
  incomeOrTurnover: number;
  userType?: 'Individuals' | 'Businesses';
  fixedAssets?: number;
}

interface Role {
  title: string;
  description: string;
}

interface TaxCategoryDetails {
  Roles: Role[];
  TaxCategories: any[];
}

interface TaxResult {
  taxName: string;
  ratePercent: number;
  amount: number;
  taxToPay: number;
  exempt: boolean;
  matchedEntityType: string;
  matchedCategory: string;
  role: string;
  message: string;
}

/**
 * Find the closest matching role and tax object from tax data
 */
function findRoleTax(
  role: string,
  taxName: string,
  taxData: any,
  userType?: 'Individuals' | 'Businesses',
  income?: number,
  fixedAssets?: number
) {
  let foundCategoryType: string | null = null;
  let foundCategory: string | null = null;
  let foundTax: any = null;
  let closestRole: string | null = null;
  let bestMatchScore = 0;

  // 🔹 Check if user qualifies automatically as Large Company . This only affect Company income tax (CIT)
  if(taxName.includes('Companies Income Tax')){
  if (
    (userType === 'Businesses' &&   income !== undefined &&  fixedAssets !== undefined &&  income >= 50_000_000)
    ||
    (  userType === 'Businesses' &&  income !== undefined &&  fixedAssets !== undefined && income < 50_000_000 &&  fixedAssets >= 250_000_000)
    ||
    (  userType === 'Businesses' && income !== undefined && fixedAssets !== undefined && income > 50_000_000 && fixedAssets > 250_000_000)
  ) {
    const largeCompanies = taxData.find(
      (d: any) => d?.Businesses?.LargeCompanies
    )?.Businesses?.LargeCompanies;

    if (largeCompanies) {
      foundCategoryType = 'Businesses';
      foundCategory = 'LargeCompanies';
      foundTax =
        largeCompanies.TaxCategories?.find((t: any) => t.name === taxName) ||
        null;
      closestRole = 'Auto-detected (Large Company)';
      return {
        foundCategoryType,
        foundCategory,
        foundTax,
        closestRole,
        autoDetected: true,
      };
    }
  }
  }

  // 🔹 Normal role-based matching
  for (const doc of taxData) {
    const topLevelKeys = userType ? [userType] : Object.keys(doc);

    for (const categoryTypeKey of topLevelKeys) {
      const categoryObj = doc[categoryTypeKey];
      if (!categoryObj || typeof categoryObj !== 'object') continue;

      for (const [categoryName, details] of Object.entries(categoryObj)) {
        const detailsTyped = details as TaxCategoryDetails;
        const roles = detailsTyped.Roles || [];

        for (const r of roles) {
          const sim = stringSimilarity(role, r.title);
          if (sim > bestMatchScore) {
            bestMatchScore = sim;
            closestRole = r.title;
            foundCategoryType = categoryTypeKey;
            foundCategory = categoryName;
            foundTax =
              detailsTyped.TaxCategories?.find((t) => t.name === taxName) ||
              null;
          }
        }
      }
    }
  }

  return {
    foundCategoryType,
    foundCategory,
    foundTax,
    closestRole,
    autoDetected: false,
  };
}


/**
 * Apply exemptions, returns TaxResult if exempt, otherwise null
 */
function applyExemptions(
  tax: any,
  incomeOrTurnover: number,
  categoryType: string,
  category: string,
  role: string,
  fixedAssets: number
) {
  if (!tax.exemptions?.length) return null;

  // check if the company is a small company based on fixed assets
  const isSmallCompany = incomeOrTurnover< 50000000 && fixedAssets < 250000000; // small comanies are those whose income is below 50 million and fixed assets below 250 million
  if(!isSmallCompany) return null;

  
  for (const ex of tax.exemptions) {
    if (
      (ex.type === 'incomeBelow' || ex.type === 'turnoverBelow') &&
      incomeOrTurnover < ex.threshold 

      //||
      // // checking for threshold. i.e if the fixed assets is below the threshold and incomebelow or turnover below is also less than the respective threshold
      //  ((ex.type === 'incomeBelow' || ex.type === 'turnoverBelow') &&
      // incomeOrTurnover < ex.threshold ) 
      // &&
      // ((ex.type === 'fixedAssets') &&
      // fixedAssets < ex.threshold) 
    ) {
      return {
        message: ex.message || 'Below exemption threshold.',
        'Tax Category': tax.name,
        'Rate (%)': tax.ratePercent,
        'Annual Income Or Turnover': formatCurrency(incomeOrTurnover),
        'Expected Annual Tax': 0,
        'Exempt': true,
         'Matched User Type': categoryType,
        'Matched Category': category,
         'Role':role,
        
      };
    }
  }

  return null;
}

/**
 * Calculate tax using progressive brackets
 */
function calculateProgressiveTax(
  tax: any,
  incomeOrTurnover: number,
  categoryType: string,
  category: string,
  role: string
) {
  let remaining = incomeOrTurnover;
  let totalTax = 0;
  let lastLimit = 0;

  for (const bracket of tax.brackets || []) {
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
  const taxToPayMonthly = totalTax/12;

  return {
    'Message': `Progressive ${tax.name} calculated for '${role}'.`,
     'Tax Category': tax.name,
     'Rate (%)': tax.ratePercent,
    'Annual Income Or Turnover': formatCurrency(incomeOrTurnover),
    'Expected Annual Tax': formatCurrency(Math.round(totalTax)),
    'Expected Monthly Tax':formatCurrency(Math.round(taxToPayMonthly)),
    'Exempt':  false,
    'Matched User Type': categoryType,
    'Matched Category': category,
    'Role': role,
    
  };
}

/**
 * Calculate tax using flat rate
 */
function calculateFlatTax(
  tax: any,
  incomeOrTurnover: number,
  categoryType: string,
  category: string,
  role: string
) {
  const flatTax = (incomeOrTurnover * tax.ratePercent) / 100;
  const taxToPayMonthly = flatTax/12;

  return {
    'Message': `Flat ${tax.name} calculated for '${role}'.`,
    'Tax Category': tax.name,
     'Rate (%)': tax.ratePercent,
   'Annual Income Or Turnover': formatCurrency(incomeOrTurnover),
    'Expected Annual Tax': formatCurrency(Math.round(flatTax)),
    'Expected Monthly Tax':formatCurrency(Math.round(taxToPayMonthly)),
    'Exempt':  false,
    'Matched User Type': categoryType,
    'Matched Category': category,
    'Role': role,
    
  };
   
}

/**
 * Main function
 */
export function TaxCalculationByTagnameRoleaEntityndIncomeLogik(
  dto: TaxCalculationInput,
  taxData: any
): any {
  const { role, taxName, incomeOrTurnover, userType, fixedAssets} = dto;

  const { foundCategoryType, foundCategory, foundTax, closestRole } =
    findRoleTax(role, taxName, taxData, userType, incomeOrTurnover, fixedAssets);

  const exemptionResult = applyExemptions(
    foundTax,
    incomeOrTurnover,
    foundCategoryType!,
    foundCategory!,
    closestRole!,
    fixedAssets!

  );

  if (exemptionResult) return exemptionResult;

  if (foundTax.brackets?.length) {
    return calculateProgressiveTax(
      foundTax,
      incomeOrTurnover,
      foundCategoryType!,
      foundCategory!,
      closestRole!
    );
  }

  return calculateFlatTax(
    foundTax,
    incomeOrTurnover,
    foundCategoryType!,
    foundCategory!,
    closestRole!
  );
}


