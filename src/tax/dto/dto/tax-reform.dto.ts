import { IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { IndividualCategoryDto } from './individual-category.dto';
import { BusinessCategoryDto } from './business-category.dto';

export class TaxReformDto {
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => IndividualCategoryDto)
  Individuals: Record<string, IndividualCategoryDto>;

  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => BusinessCategoryDto)
  Businesses: Record<string, BusinessCategoryDto>;
}

export class InsertTaxReformDto {
  @ValidateNested()
  @Type(() => TaxReformDto)
  NigeriaTaxReform2025: TaxReformDto;
}
