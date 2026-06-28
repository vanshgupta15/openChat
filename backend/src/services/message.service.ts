import { MessageModel, IMessageDocument } from '../models/message.model';

export const getMessagesByRoom = async (roomId: string): Promise<IMessageDocument[]> => {
  return await MessageModel.find({ roomId }).sort({ createdAt: 1 });
};

export const saveMessage = async (roomId: string, username: string, message: string): Promise<IMessageDocument> => {
  const newMessage = new MessageModel({ roomId, username, message });
  return await newMessage.save();
};
