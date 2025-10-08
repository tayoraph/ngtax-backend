import { IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { RoleDto } from './role.dto';

export class BusinessCategoryDto {
  @IsString()
  turnoverRange: string;

  @IsArray()
  @IsString({ each: true })
  taxCategories: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RoleDto)
  roles: RoleDto[];
}
