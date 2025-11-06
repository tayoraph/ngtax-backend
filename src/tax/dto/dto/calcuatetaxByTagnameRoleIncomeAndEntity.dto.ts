import { ApiProperty } from "@nestjs/swagger";

export class  TaxCalculationByTagnameRoleaEntityndIncomeInput {
@ApiProperty()
  role: string;
@ApiProperty()
  taxName: string;
@ApiProperty()
  incomeOrTurnover: number;
@ApiProperty()
  userType?: 'Individuals' | 'Businesses'; // optional filter
  @ApiProperty()
  fixedAssets?: number
}