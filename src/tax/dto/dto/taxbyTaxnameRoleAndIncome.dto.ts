import { ApiProperty } from '@nestjs/swagger';

export class TaxCalculationByTaxNameRoleAndIncomeDto {
      @ApiProperty()
    
  role: string;
      @ApiProperty()

  taxName: string;
      @ApiProperty()

  incomeOrTurnover: number;
}
