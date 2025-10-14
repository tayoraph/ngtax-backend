import { Injectable, LoggerService } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TaxCategory, TaxCategoryDocument } from '../schema/tax.schema';

@Injectable()
export class TaxCategoryService {
  constructor(
    @InjectModel(TaxCategory.name) private taxCategoryModel: Model<TaxCategoryDocument>,
     //private readonly logger: LoggerService
  ) {}

  async findAll(): Promise<TaxCategory[]> {
   //    this.logger.log(`[${new Date().toISOString()}] get rall categories`);
    return this.taxCategoryModel.find().exec();
  }

  async findByCategoryType(categoryType: 'Individuals' | 'Businesses'): Promise<TaxCategory[]> {
      // this.logger.log(`[${new Date().toISOString()}] get by  categories`);
    return this.taxCategoryModel.find({ categoryType }).exec();
  }

  async create(taxCategory: Partial<TaxCategory>): Promise<TaxCategory> {
      // this.logger.log(`[${new Date().toISOString()}] create tax  category`);
    const created = new this.taxCategoryModel(taxCategory);
    return created.save();
  }
}
