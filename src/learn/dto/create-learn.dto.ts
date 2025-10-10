import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateLearnDto {
  @ApiProperty({ example: 'Tax Basics' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Learn about tax changes in 2025.' })
  @IsString()
  @IsNotEmpty()
  content: string;
}