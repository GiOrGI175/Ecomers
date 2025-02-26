import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class cart {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Products' })
  productId: mongoose.Schema.Types.ObjectId;

  @Prop({ default: 1 })
  quantity: number;
}

export const CartSchema = SchemaFactory.createForClass(cart);
