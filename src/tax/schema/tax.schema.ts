import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TaxCategoryDocument = TaxCategory & Document;

@Schema({ timestamps: true }) // createdAt & updatedAt auto-added
@Schema()
export class TaxCategory {
  @Prop({ required: true })
  name: string;

  @Prop()
  type: string;

  @Prop()
  level: string;

  @Prop()
  description: string;

  @Prop()
  rate?: number;

  @Prop()
  fullDescription?: string

}

export const TaxCategorySchema = SchemaFactory.createForClass(TaxCategory);
