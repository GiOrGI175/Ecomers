import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import { Role } from 'src/enums/roles.enum';

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String })
  firstName: String;

  @Prop({ type: String })
  lastName: String;

  @Prop({ type: String })
  email: String;

  @Prop({ type: String })
  password: string;

  @Prop({ type: String, enum: Role, default: Role.USER })
  role: string;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Products',
    default: [],
  })
  Products: mongoose.Schema.Types.ObjectId[];

  @Prop({
    type: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Products' },
        quantity: { type: Number, default: 1 },
        totalPrice: { type: Number, default: 0 },
      },
    ],
    default: [],
  })
  cart: {
    productId: mongoose.Types.ObjectId;
    quantity: number;
    totalPrice: number;
  }[];

  @Prop({
    type: [
      {
        products: [
          {
            productId: { type: Types.ObjectId, ref: 'Products' },
            quantity: { type: Number, default: 1 },
            totalPrice: { type: Number, default: 0 },
          },
        ],
        orderDate: { type: Date, default: Date.now },
        status: { type: String, default: 'pending' },
      },
    ],
    default: [],
  })
  orders: {
    products: {
      productId: Types.ObjectId;
      quantity: number;
      totalPrice: number;
    }[];
    orderDate: Date;
    status: string;
  }[];

  @Prop({ type: Boolean, default: false })
  isVerifed: boolean;

  @Prop({ type: String })
  otpCode: string;

  @Prop({ type: Date })
  otpCodeValidationData: Date;

  @Prop({ type: String })
  avatar: string;
}
export const userSchema = SchemaFactory.createForClass(User);
