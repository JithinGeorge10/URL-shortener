import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UrlDocument = Url & Document;

@Schema()
export class Url {
  @Prop({ required: true })
  originalUrl: string;

  @Prop({ required: true, unique: true })
  shortUrl: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const UrlSchema = SchemaFactory.createForClass(Url);
