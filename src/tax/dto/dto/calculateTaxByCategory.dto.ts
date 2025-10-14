import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CalculateTaxByCategoryDto {
  @ApiProperty({ example: 'Tax Name' })
  @IsString()
  @IsNotEmpty()
  taxName: string; // e.g., "Personal Income Tax (PIT)" or "Value Added Tax (VAT)"

  @ApiProperty({ example: 'Amount' })
  @Type(() => Number)
  @IsNumber()
  amount: number; // income / gain / turnover

@ApiProperty({ example: 'entity Type' })
  @IsString()
  @IsOptional()
  entityType?: 'Individuals' | 'Businesses'; // optional, helps locate tax


@ApiProperty({ example: 'category' })
  @IsString()
  @IsOptional()
  category?: string; // e.g., "WhiteCollar", "LargeCompanies"


@ApiProperty({ example: 'role' })
  @IsString()
  @IsOptional()
  role?: string; // optional context, e.g., "CEO"

@ApiProperty({ example: 'item' })
  @IsString()
  @IsOptional()
  item?: string; // for goodsServices exemptions (e.g., "food")
}
