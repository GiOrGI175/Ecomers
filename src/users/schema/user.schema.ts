import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
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
}

export const userSchema = SchemaFactory.createForClass(User);
