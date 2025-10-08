import { Prop, SchemaFactory ,Schema} from "@nestjs/mongoose";
import { Exemption, ExemptionSchema } from "./tax-exemption.schema";

@Schema()
export class TaxCategory {
  @Prop({ required: true })
  name: string; // e.g., 'Personal Income Tax (PIT)'

  @Prop({ required: true })
  ratePercent: number; // e.g., 7, 15, 30

  @Prop({ type: [ExemptionSchema], default: [] })
  exemptions: Exemption[];
}

export const TaxCategorySchema = SchemaFactory.createForClass(TaxCategory);
export type TaxCategoryDocument = TaxCategory & Document;
