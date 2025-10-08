import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { RoleSchema, Role } from './role.schema';
import { TaxCategory, TaxCategorySchema } from './tax.schema';

export type IndividualCategoryDocument = IndividualCategory & Document;

@Schema()
export class IndividualCategory {
  @Prop({ required: true })
  SalaryRange: string;

  @Prop({ type: [TaxCategorySchema], default: [] })
  TaxCategories: TaxCategory[];

  @Prop({ type: [RoleSchema], default: [] })
  Roles: Role[];
}

export const IndividualCategorySchema = SchemaFactory.createForClass(IndividualCategory);

@Schema()
export class BusinessCategory {
  @Prop({ required: true })
  TurnoverRange: string;

  @Prop({ type: [TaxCategorySchema], default: [] })
  TaxCategories: TaxCategory[];

  @Prop({ type: [RoleSchema], default: [] })
  Roles: Role[];
}

export const BusinessCategorySchema = SchemaFactory.createForClass(BusinessCategory);
