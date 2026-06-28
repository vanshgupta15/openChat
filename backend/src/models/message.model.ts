import { Schema, model, Document, Types } from 'mongoose';

export interface IMessageDocument extends Document {
  roomId: Types.ObjectId;
  username: string;
  message: string;
  createdAt: Date;
}

const messageSchema = new Schema<IMessageDocument>({
  roomId: {
    type: Schema.Types.ObjectId,
    ref: 'Room',
    required: true,
  },
  username: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const MessageModel = model<IMessageDocument>('Message', messageSchema);
