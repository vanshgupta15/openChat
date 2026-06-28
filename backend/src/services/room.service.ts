import { RoomModel, IRoomDocument } from '../models/room.model';

export const getAllRooms = async (): Promise<IRoomDocument[]> => {
  return await RoomModel.find().sort({ roomName: 1 });
};

export const getRoomById = async (id: string): Promise<IRoomDocument | null> => {
  return await RoomModel.findById(id);
};

export const createRoom = async (roomName: string): Promise<IRoomDocument> => {
  const newRoom = new RoomModel({ roomName });
  return await newRoom.save();
};

export const roomExists = async (roomName: string): Promise<boolean> => {
  const count = await RoomModel.countDocuments({ roomName: { $regex: new RegExp(`^${roomName}$`, 'i') } });
  return count > 0;
};
