import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TaxReform, TaxReformDocument } from '../schema/tax-reform.schema';
import { LoggerService } from '../../shared/logger/loggerService';
import { CalculateTaxByCategoryDto } from '../dto/dto/calculateTaxByCategory.dto';
import { stringSimilarity } from '../../utils/string.similarity.utils';
import { calculateTaxLogic } from '../../utils/tax-calculatorbyRoleTagNameIncome.utils';
import { TaxCalculationByTagnameRoleaEntityndIncomeLogik } from '../../utils/tac-calculator-by-roleTagNameEntityIncome';
import { TaxCalculationByTagnameRoleaEntityndIncomeInput } from '../dto/dto/calcuatetaxByTagnameRoleIncomeAndEntity.dto';
@Injectable()
export class TaxReformService {
  constructor(
    @InjectModel(TaxReform.name)
    private readonly taxReformModel: Model<TaxReformDocument>,
    private readonly logger: LoggerService
  ) {}

  // -----------------------
  // INSERT DATA
  // -----------------------
  async insertTaxData(data: any): Promise<TaxReform> {
    const doc = new this.taxReformModel({
      individuals: data.NigeriaTaxReform2025.Individuals,
      businesses: data.NigeriaTaxReform2025.Businesses,
    });
    return doc.save();
  }

  // -----------------------
  // GET ALL
  // -----------------------
  async getAll(): Promise<TaxReform[]> {
    return this.taxReformModel.find().exec();
  }

  // -----------------------
  // GET BY CATEGORY
  // -----------------------
  async getByCategory(category: string) {
    const doc = await this.taxReformModel.findOne().lean();
    if (!doc) throw new NotFoundException('Tax data not found');

    const individualMatch = doc.Individuals?.[category];
    const businessMatch = doc.Businesses?.[category];

    if (!individualMatch && !businessMatch)
      throw new NotFoundException(`No category found for "${category}"`);

    return individualMatch || businessMatch;
  }

  // -----------------------
  // GET BY ROLE
  // -----------------------
  async getByRole(roleTitle: string) {
    const doc = await this.taxReformModel.findOne().lean();
    if (!doc) throw new NotFoundException('Tax data not found');

    const searchRole = roleTitle.toLowerCase();

    // Search through Individuals
    for (const [category, data] of Object.entries(doc.Individuals || {})) {
      const found = data.Roles.find(
        (r: any) => r.title.toLowerCase() === searchRole,
      );
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
      const found = data.Roles.find(
        (r: any) => r.title.toLowerCase() === searchRole,
      );
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

    throw new NotFoundException(`Role "${roleTitle}" not found`);
  }

  //#region roles Get by Tax Category

  // -----------------------
  // GET BY TAX CATEGORY (Optional)
  // -----------------------
async getRolesByTaxCategory(taxCategory: string) {
  try {
    const doc = await this.taxReformModel.findOne().lean();
    if (!doc) throw new NotFoundException('Tax data not found');

    const allRoles: any[] = [];

    const processEntity = (entityType: string, entityData: Record<string, any>) => {
      for (const data of Object.values(entityData || {})) {
        const typedData = data as { TaxCategories: any[]; Roles: any[] };

        if (
          typedData.TaxCategories.some(
            (tax: any) => tax.name.toLowerCase() === taxCategory.toLowerCase(),
          )
        ) {
          const rolesWithEntity = typedData.Roles.map((role: any) => ({
            ...role,
            entityType,
          }));

          allRoles.push(...rolesWithEntity); // push each role individually
        }
      }
    };

    processEntity('Individuals', doc.Individuals ?? {});
    processEntity('Businesses', doc.Businesses ?? {});

    if (allRoles.length === 0)
      throw new NotFoundException(`No records found for tax "${taxCategory}"`);

    return allRoles;
  } catch (err) {
    console.log(err);
    throw err;
  }
}



  //#endregion

  //#region Get roles 

  // get roles 
    async getAllRoles(): Promise<any[]> {
       this.logger.log(`[${new Date().toISOString()}] get roles request entered service layer`);
    const doc = await this.taxReformModel.findOne().lean();
    if (!doc) return [];

    const allRoles: any[] = [];

    // Extract roles from individuals
    if (doc.Individuals && typeof doc.Individuals === 'object') {
      Object.values(doc.Individuals).forEach((category: any) => {
        if (Array.isArray(category.Roles)) {
          allRoles.push(...category.Roles);
        }
      });
    }

    // Extract Roles from businesses
    if (doc.Businesses && typeof doc.Businesses === 'object') {

      Object.values(doc.Businesses).forEach((category: any) => {
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

  private formatCurrency(amount: number): string {
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
private inRange(value: number, rangeStr: string): boolean | string {
  const [minStr, maxStr] = rangeStr
    .replace(/₦| per year|\+/g, '')
    .split('–')
    .map(s => s.trim().replace(/,/g, ''));

  const min = parseInt(minStr, 10);
  const max = maxStr ? parseInt(maxStr, 10) : Number.MAX_SAFE_INTEGER;

  if (isNaN(min)) return 'Invalid salary/turnover range';
  if (isNaN(max)) return 'Invalid salary/turnover range';

  if (value < min) return false; // Exempt case
  if (value > max) {
    return `Provided income ${this.formatCurrency(value)} exceeds allowed maximum of ${this.formatCurrency(max)}.`;
  }
  return true;
}



  private estimateTax(income: number, taxCategories: string[]) {
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
async calculateTaxByRoleAndIncome(roleTitle: string, income: number): Promise<any> {
  const taxData = await this.taxReformModel.findOne().lean();

  if (!taxData) {
    throw new NotFoundException('Tax data not found');
  }

  const formatCurrency = (value: number): string =>
    `₦${value.toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  const parseRange = (rangeStr: string): [number, number] => {
    const numbers = rangeStr.match(/[\d,]+/g)?.map(n => Number(n.replace(/,/g, '')));
    if (!numbers || numbers.length < 1) return [0, Infinity];
    return [numbers[0], numbers[1] || Infinity];
  };

  const checkExemptions = (taxCategory: any, amount: number): boolean => {
    if (!taxCategory.exemptions) return false;

    for (const exemption of taxCategory.exemptions) {
      switch (exemption.type) {
        case 'incomeBelow':
        case 'turnoverBelow':
        case 'gainsBelow':
          if (amount <= exemption.threshold) return true;
          break;
      }
    }
    return false;
  };

  const calculateCategoryTax = (taxCategory: any, amount: number): number => {
    if (checkExemptions(taxCategory, amount)) return 0;
    return (amount * (taxCategory.ratePercent || 0)) / 100;
  };

  // Handle individuals
  const individuals = taxData.Individuals ?? {};
  for (const categoryName in individuals) {
    const category = individuals[categoryName];
    const matchedRole = category.Roles.find((role: any) => role.title === roleTitle);

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
      const taxCategories: string[] = [];
      const exemptedTaxCategories: string[] = [];

      for (const taxCategory of category.TaxCategories) {
        const isExempted = checkExemptions(taxCategory, income);
        const taxAmount = calculateCategoryTax(taxCategory, income);
        if (isExempted) {
          exemptedTaxCategories.push(taxCategory.name);
        } else {
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

      let resp= {
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
    
    console.log(resp)
    return resp
    }
  }

  // Handle businesses
  const businesses = taxData.Businesses ?? {};
  for (const categoryName in businesses) {
    const category = businesses[categoryName];
    const matchedRole = category.Roles.find((role: any) => role.title === roleTitle);

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
      const taxCategories: string[] = [];
      const exemptedTaxCategories: string[] = [];

      for (const taxCategory of category.TaxCategories) {
        const isExempted = checkExemptions(taxCategory, income);
        const taxAmount = calculateCategoryTax(taxCategory, income);
        if (isExempted) {
          exemptedTaxCategories.push(taxCategory.name);
        } else {
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

  throw new NotFoundException(`Role "${roleTitle}" not found in any tax category.`);
}


  //#endregion


//////////////////////////////////Tax by Category

//#region Calculate tax by Category 

  async getDoc() {
    const doc = await this.taxReformModel.findOne().lean().exec();
    if (!doc) throw new NotFoundException('Tax data not found.');
    return doc;
  }

  // find tax category entry by taxName, optionally limited by entityType/category
  private findTaxEntry(data: any, taxName: string, entityType?: string, category?: string) {
    const matches: Array<{ entityType: string; category: string; tax: any; context: any }> = [];

    const searchIn = (etype: 'Individuals' | 'Businesses') => {
      const group = data?.[etype];
      if (!group) return;
      for (const [catKey, catVal] of Object.entries(group)) {
        const taxes = (catVal as any).TaxCategories || [];
        for (const t of taxes) {
          if (String(t.name).toLowerCase() === String(taxName).toLowerCase()) {
            matches.push({ entityType: etype, category: catKey, tax: t, context: catVal });
          }
        }
      }
    };

    if (entityType) {
      if (entityType === 'Individuals' || entityType === 'Businesses') {
        // restrict to given entityType
        const group = data?.NigeriaTaxReform2025?.[entityType];
        if (!group) return [];
        if (category) {
          const catVal = group[category];
          if (!catVal) return [];
          const taxes = catVal.TaxCategories || [];
          return taxes.filter((t: any) => String(t.name).toLowerCase() === taxName.toLowerCase())
            .map((t: any) => ({ entityType, category, tax: t, context: catVal }));
        } else {
          // search all categories under entityType
          for (const [catKey, catVal] of Object.entries(group)) {
            const taxes = (catVal as any).TaxCategories || [];
            for (const t of taxes) {
              if (String(t.name).toLowerCase() === String(taxName).toLowerCase()) {
                matches.push({ entityType, category: catKey, tax: t, context: catVal });
              }
            }
          }
          return matches;
        }
      } else {
        return [];
      }
    }

    // no entityType constraint — search both
    searchIn('Individuals');
    searchIn('Businesses');

    // if a category constraint provided, filter it
    if (category) {
      return matches.filter(m => m.category.toLowerCase() === category.toLowerCase());
    }

    return matches;
  }

  private isExemptByRules(tax: any, amount: number, dto: CalculateTaxByCategoryDto) {
    const exemptions = tax.exemptions || [];
    for (const ex of exemptions) {
      const type = ex.type;
      if (type === 'incomeBelow' && dto.taxName.toLowerCase().includes('income')) {
        if (amount <= Number(ex.threshold)) return { exempt: true, message: ex.message || 'Exempt' };
      }
      if (type === 'gainsBelow' && dto.taxName.toLowerCase().includes('gain')) {
        if (amount <= Number(ex.threshold)) return { exempt: true, message: ex.message || 'Exempt' };
      }
      if (type === 'turnoverBelow' && dto.taxName.toLowerCase().includes('company')) {
        if (amount <= Number(ex.threshold)) return { exempt: true, message: ex.message || 'Exempt' };
      }
      if (type === 'goodsServices') {
        // check dto.item against exemptItems
        if (!dto.item) continue; // can't decide without item
        const exemptItems = ex.exemptItems || [];
        if (exemptItems.map((i: string)=>i.toLowerCase()).includes(dto.item.toLowerCase())) {
          return { exempt: true, message: ex.message || 'Exempt' };
        }
      }
    }
    return { exempt: false };
  }

  /**
   * Calculate tax for a given taxName and amount. 
   * If multiple matches exist, uses the first match if not disambiguated by entityType/category.
   */
  async calculateByTaxCategory(dto: CalculateTaxByCategoryDto) {
    const data = await this.getDoc();
    const matches = this.findTaxEntry(data, dto.taxName, dto.entityType, dto.category);

    if (!matches || matches.length === 0) {
      throw new NotFoundException(`Tax "${dto.taxName}" not found in stored tax data.`);
    }

    // choose best match:
    const match = matches[0];

    const tax = match.tax;
    const rate = Number(tax.ratePercent);
    if (isNaN(rate)) throw new BadRequestException('Invalid tax rate stored.');

    // check exemptions
    const exemption = this.isExemptByRules(tax, dto.amount, dto);
    if (exemption.exempt) {
      return {
        taxName: tax.name,
        ratePercent: rate,
        amount: dto.amount,
        taxToPay: 0,
        exempt: true,
        message: exemption.message,
        matchedEntityType: match.entityType,
        matchedCategory: match.category,
      };
    }

    const taxToPay = (rate / 100) * dto.amount;

    return {
      taxName: tax.name,
      ratePercent: rate,
      amount: dto.amount,
      taxToPay,
      exempt: false,
      matchedEntityType: match.entityType,
      matchedCategory: match.category,
    };
  }
//#endregion


//#region  calculate by role, taxname  and income
 
    async calculateTaxByRoleAndTaxnameAndIncome(dto: { role: string; taxName: string; incomeOrTurnover: number }) {
    const { role, taxName, incomeOrTurnover } = dto;
    const taxData = await this.taxReformModel.find().lean();
    if (!taxData) throw new NotFoundException('Tax data not found.');

    return calculateTaxLogic({
      role,
      taxName,
      incomeOrTurnover,
      taxData: taxData,
    });
  }
//#endregion




//#region  calculate by role, taxname  and income
 
    async calculateTaxByRoleAndTaxnameEntityAndIncome(dto: TaxCalculationByTagnameRoleaEntityndIncomeInput) {
    const taxData = await this.taxReformModel.find().lean();;
    if (!taxData) throw new NotFoundException('Tax data not found.');

    return TaxCalculationByTagnameRoleaEntityndIncomeLogik(
     dto,
     taxData
    );
  }
//#endregion

}
