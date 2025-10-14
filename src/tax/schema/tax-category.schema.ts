import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TaxCategoryDocument = TaxCategory & Document;

// Nested interfaces for strong typing
export interface Exemption {
  type: string;
  threshold?: number;
  exemptItems?: string[];
  message?: string;
}

export interface Bracket {
  upTo?: number;
  above?: number;
  ratePercent: number;
}

export interface TaxItem {
  name: string;
  ratePercent: number;
  exemptions?: Exemption[];
  brackets?: Bracket[];
  note?: string;
}

export interface SubCategoryData {
  SalaryRange?: string;
  TurnoverRange?: string;
  TaxCategories: TaxItem[];
}

export interface TaxData {
  Individuals?: Record<string, SubCategoryData>;
  Businesses?: Record<string, SubCategoryData>;
}

@Schema({ timestamps: true })
export class TaxCategory {
  @Prop({ required: true })
  categoryType: 'Individuals' | 'Businesses';

  @Prop({ required: true })
  subCategory: string;

  @Prop({ type: Object, required: true })
  data: SubCategoryData;
}

export const TaxCategorySchema = SchemaFactory.createForClass(TaxCategory);
