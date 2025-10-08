import { IsString } from 'class-validator';

export class RoleDto {
  @IsString()
  title: string;

  @IsString()
  description: string;
}
