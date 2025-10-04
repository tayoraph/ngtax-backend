import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CalculateTaxDto {
  @IsNotEmpty()
  category: string;

  @IsNumber()
  @Min(0)
  amount: number;
}
