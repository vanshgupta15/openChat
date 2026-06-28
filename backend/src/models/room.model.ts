import { Schema, model, Document } from 'mongoose';

export interface IRoomDocument extends Document {
  roomName: string;
  createdAt: Date;
}

const roomSchema = new Schema<IRoomDocument>({
  roomName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const RoomModel = model<IRoomDocument>('Room', roomSchema);
