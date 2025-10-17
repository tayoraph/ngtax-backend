import { Controller, Get, Param, Query } from '@nestjs/common';
import { TaxCategory } from '../schema/tax.schema';
import { TaxCategoryService } from '../service/tax-category.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TaxReformDocument } from '../schema/tax-reform.schema';

@ApiTags('taxcategory')
@ApiBearerAuth()
@Controller('tax-categories')
export class TaxCategoryController {
  constructor(private readonly taxCategoryService: TaxCategoryService) {}

  @Get()
  getAll(): Promise<TaxCategory[]> {
    return this.taxCategoryService.findAll();
  }

  @Get('/getCategoryByUserType/:userType')
  getCategoryByUserType(@Param('userType') categoryType: 'Individuals' | 'Businesses'): Promise<TaxReformDocument[]> {
    return this.taxCategoryService.getCategoryByUserType(categoryType);
  }

  @Get('/getRolesByTax/:entity/:taxName')
  async getRolesByTax(
    @Param('entity') entity: 'Individuals' | 'Businesses',
    @Param('taxName') taxName: string,
  ) {
    return this.taxCategoryService.getRolesByEntityAndTaxCategory(entity, taxName);
  }
}
