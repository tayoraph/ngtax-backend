import { Controller, Get, Param } from '@nestjs/common';
import { TaxCategory } from '../schema/tax.schema';
import { TaxCategoryService } from '../service/tax-category.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('taxcategory')
@ApiBearerAuth()
@Controller('tax-categories')
export class TaxCategoryController {
  constructor(private readonly taxCategoryService: TaxCategoryService) {}

  @Get()
  getAll(): Promise<TaxCategory[]> {
    return this.taxCategoryService.findAll();
  }

  @Get(':categoryType')
  getByCategory(@Param('categoryType') categoryType: 'Individuals' | 'Businesses'): Promise<TaxCategory[]> {
    return this.taxCategoryService.findByCategoryType(categoryType);
  }
}
