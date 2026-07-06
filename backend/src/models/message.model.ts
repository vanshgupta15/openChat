import { Schema, model, Document, Types } from 'mongoose';

export interface IMessageDocument extends Document {
  roomId: Types.ObjectId;
  userId: string;
  displayName: string;
  photoURL: string;
  message: string;
  createdAt: Date;
}

const messageSchema = new Schema<IMessageDocument>({
  roomId: {
    type: Schema.Types.ObjectId,
    ref: 'Room',
    required: true,
  },
  userId: {
    type: String,
    required: true,
    trim: true,
  },
  displayName: {
    type: String,
    required: true,
    trim: true,
  },
  photoURL: {
    type: String,
    default: '',
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
