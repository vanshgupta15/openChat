import { MessageModel, IMessageDocument } from '../models/message.model';

export const getMessagesByRoom = async (roomId: string): Promise<IMessageDocument[]> => {
  console.log(`in messages service layer in getMessagesByRoom method - Querying MessageModel for messages in roomId: ${roomId} sorted by createdAt.`);
  return await MessageModel.find({ roomId }).sort({ createdAt: 1 });
};

export const saveMessage = async (roomId: string, username: string, message: string): Promise<IMessageDocument> => {
  console.log(`in messages service layer in saveMessage method - Saving new MessageModel in roomId: ${roomId} by username: "${username}"`);
  const newMessage = new MessageModel({ roomId, username, message });
  return await newMessage.save();
};
