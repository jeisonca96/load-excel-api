import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { LoadExcelStatus } from '../constants';

export type LoadExcelDocument = LoadExcel & Document;

@Schema({
  strict: false,
  timestamps: {
    createdAt: 'created',
    updatedAt: 'modified',
  },
})
export class LoadExcel {
  @Prop({
    enum: LoadExcelStatus,
  })
  status: string;

  @Prop()
  errors?: Array<any>;

  @Prop()
  data?: Array<any>;

  @Prop()
  processTime?: number;

  @Prop()
  countRows?: number;
}

export const LoadExcelSchema = SchemaFactory.createForClass(LoadExcel);
