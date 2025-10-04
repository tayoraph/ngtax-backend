import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CalculateTaxDto } from '../schema/dto/calculate-tax.dto';
import { TaxCategory, TaxCategoryDocument } from '../schema/tax.schema';
import { CreateTaxCategoryDto } from '../dto/create-tax-category.dto';
import { UpdateTaxCategoryDto } from '../dto/update-tax-category.dto';
import { FileLogger } from '../../common/logger/file-logger.service';
@Injectable()
export class TaxService {
  constructor(@InjectModel(TaxCategory.name) private taxModel: Model<TaxCategoryDocument>, private readonly logger: FileLogger) {}

  async findAll() {
    return this.taxModel.find().exec();
  }

  async calculateTax(dto: CalculateTaxDto) {
     this.logger.log(`Calculating tax for category ${dto.category} on amount ${dto.amount}`, 'TaxService');

    const tax = await this.taxModel.findOne({ name: dto.category }).exec();
    if (!tax) throw new NotFoundException('Tax category not found');

    const rate = tax.rate ?? 0;
    const calculated = dto.amount * rate;

    return {
      category: tax.name,
      amount: dto.amount,
      rate,
      tax: calculated,
      total: dto.amount + calculated,
    };
  }

  /**
   * 
   * @param dto create tax category 
   * @returns 
   */

    async createCategory(dto: CreateTaxCategoryDto) {
    this.logger.log(`creating new tax category`, 'TaxService');

    const newCategory = new this.taxModel(dto);
    return newCategory.save();
    }


    /**
     * @todo Update tax category 
     */
    async updateCategory(id: string, dto: UpdateTaxCategoryDto) {
    this.logger.log(`Updating tax category by id ${id} and update request data ${dto}`, 'TaxService');

    if (!Types.ObjectId.isValid(id)) {
        throw new NotFoundException('Invalid tax category ID');
    }

    const updated = await this.taxModel.findByIdAndUpdate(id, dto, { new: true });
    if (!updated) throw new NotFoundException('Tax category not found');

    return updated;
    }

    /**
     * Delete a tax 
     */
    // Inside TaxService
    async deleteCategory(id: string) {
    this.logger.log(`deleting tax category by id ${id}`, 'TaxService');

    if (!Types.ObjectId.isValid(id)) {
        throw new NotFoundException('Invalid tax category ID');
    }

    const deleted = await this.taxModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('Tax category not found');

    return { message: 'Tax category deleted successfully' };
    }
}
