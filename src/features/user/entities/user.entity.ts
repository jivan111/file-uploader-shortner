import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class User {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;


  @Prop({ type: String, required: true, select: false })
  otp: string;

  @Prop({ type: Boolean, default: false })
  isVerified: boolean;

  @Prop({ type: Date, required: true })
  otpSentAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
