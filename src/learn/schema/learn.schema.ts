import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LearnDocument = Learn & Document;

@Schema({ timestamps: true })
export class Learn {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;
}

export const LearnSchema = SchemaFactory.createForClass(Learn);
