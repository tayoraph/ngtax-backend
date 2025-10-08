import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Exemption {
  @Prop({ required: true })
  type: string;  // e.g., 'incomeBelow', 'turnoverBelow', 'gainsBelow', 'goodsServices'

  @Prop()
  threshold?: number; // optional numeric threshold for exemption

  @Prop({ default: '' })
  message: string; // exemption description/message

  @Prop({ type: [String], default: [] })
  exemptItems?: string[]; // e.g. for VAT exemption on food, education, etc.
}

export const ExemptionSchema = SchemaFactory.createForClass(Exemption);
export type ExemptionDocument = Exemption & Document;
