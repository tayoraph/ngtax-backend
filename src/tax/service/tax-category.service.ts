import { Injectable, LoggerService, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TaxCategory, TaxCategoryDocument } from '../schema/tax.schema';
import { TaxReform, TaxReformDocument } from '../schema/tax-reform.schema';

@Injectable()
export class TaxCategoryService {
  constructor(
    @InjectModel(TaxCategory.name) private taxCategoryModel: Model<TaxCategoryDocument>,
     @InjectModel(TaxReform.name)
        private readonly taxReformModel: Model<TaxReformDocument>,
     //private readonly logger: LoggerService
  ) {}

  async findAll(): Promise<TaxCategory[]> {
   //    this.logger.log(`[${new Date().toISOString()}] get rall categories`);
    return this.taxCategoryModel.find().exec();
  }

  async getCategoryByUserType(entityType: 'Individuals' | 'Businesses'): Promise<TaxReformDocument[]> {
      // this.logger.log(`[${new Date().toISOString()}] get by  categories`);
const taxData = await this.taxReformModel.findOne().lean();
      if (!taxData) throw new NotFoundException('Tax data not found');
  
      /**
   * Get all unique tax categories for either Individuals or Businesses
   */
  // async getUniqueTaxCategories(entityType: 'Individuals' | 'Businesses') {
  //   const taxData = await this.taxModel.findOne().lean();

    const section = taxData[entityType];
    if (!section) throw new NotFoundException(`No data found for ${entityType}.`);

    const uniqueCategoriesMap = new Map<string, any>();

    // Loop through subcategories (like WhiteCollar, BlueCollar, etc.)
    for (const [subName, subData] of Object.entries(section)) {
      const categories = subData['TaxCategories'] ?? [];

      for (const tax of categories) {
        const taxName = tax.name.trim();

        // If this tax name hasn't been added yet, add it
        if (!uniqueCategoriesMap.has(taxName)) {
          uniqueCategoriesMap.set(taxName, {
            name: taxName,
            ratePercent: tax.ratePercent ?? null,
            exemptions: tax.exemptions ?? [],
            note: tax.note ?? '',
          });
        }
      }
    }

    // Return all unique tax categories
    return Array.from(uniqueCategoriesMap.values());
  
  }

  
  

  async create(taxCategory: Partial<TaxCategory>): Promise<TaxCategory> {
      // this.logger.log(`[${new Date().toISOString()}] create tax  category`);
    const created = new this.taxCategoryModel(taxCategory);
    return created.save();
  }



    /**
   * Get all roles by entity type (Individuals | Businesses)
   * filtered by a specific tax category name
   */
  async getRolesByEntityAndTaxCategory(
    entityType: 'Individuals' | 'Businesses',
    taxCategoryName: string,
  ) {
    const taxData = await this.taxReformModel.findOne().lean();
    if (!taxData) throw new NotFoundException('Tax data not found.');

    const section = taxData[entityType];
    if (!section) throw new NotFoundException(`No data found for ${entityType}.`);

    const rolesSet = new Map<string, any>();
    const normalizedTaxName = taxCategoryName.trim().toLowerCase();

    for (const [subName, subData] of Object.entries(section)) {
      const categories = subData['TaxCategories'] ?? [];

      const hasTaxCategory = categories.some(
        (tax:any) => tax.name.trim().toLowerCase() === normalizedTaxName,
      );

      if (hasTaxCategory) {
        const roles = subData['Roles'] ?? [];
        for (const role of roles) {
          if (!rolesSet.has(role.title)) {
            rolesSet.set(role.title, {
              title: role.title,
              description: role.description,
              categoryGroup: subName, // optional: shows where the role belongs
            });
          }
        }
      }
    }

    const allRoles = Array.from(rolesSet.values());
    if (allRoles.length === 0)
      throw new NotFoundException(
        `No roles found under ${entityType} with tax category "${taxCategoryName}".`,
      );

    return allRoles;
  }





}
