import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PostDocument = HydratedDocument<Post>;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Post {
  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: String, required: true })
  fileUrl: string;


  @Prop({ type: String, required: true })
  fileType: string;

  @Prop({ type: String, required: true })
  fileName: string;

  @Prop({ type: String, required: true })
  fileSize: string;

  @Prop({ type: String, required: true })
  shortUrlCode: string;




}

export const PostSchema = SchemaFactory.createForClass(Post);
