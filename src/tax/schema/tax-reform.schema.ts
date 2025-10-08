import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IndividualCategory, BusinessCategory, IndividualCategorySchema, BusinessCategorySchema } from './category.schema';


export type TaxReformDocument = TaxReform & Document;

@Schema()
export class TaxReform {
  @Prop({ 
    type: Map, 
    of: IndividualCategorySchema, 
    default: new Map() 
  })
  Individuals: Map<string, IndividualCategory>;

  @Prop({ 
    type: Map, 
    of: BusinessCategorySchema, 
    default: new Map() 
  })
  Businesses: Map<string, BusinessCategory>;
}

export const TaxReformSchema = SchemaFactory.createForClass(TaxReform);
