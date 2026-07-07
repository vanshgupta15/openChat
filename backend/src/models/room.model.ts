import { Schema, model, Document } from 'mongoose';

export interface IRoomDocument extends Document {
  roomName: string;
  password?: string;
  creatorId?: string;
  createdAt: Date;
}

const roomSchema = new Schema<IRoomDocument>({
  roomName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    default: '2222',
  },
  creatorId: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const RoomModel = model<IRoomDocument>('Room', roomSchema);
