import { RoomModel, IRoomDocument } from '../models/room.model';

export const getAllRooms = async (): Promise<IRoomDocument[]> => {
  console.log('in rooms service layer in getAllRooms method - Querying RoomModel for all rooms sorted by name.');
  return await RoomModel.find().sort({ roomName: 1 });
};

export const getRoomById = async (id: string): Promise<IRoomDocument | null> => {
  console.log(`in rooms service layer in getRoomById method - Querying RoomModel for ID: ${id}`);
  return await RoomModel.findById(id);
};

export const createRoom = async (roomName: string): Promise<IRoomDocument> => {
  console.log(`in rooms service layer in createRoom method - Saving new RoomModel: "${roomName}"`);
  const newRoom = new RoomModel({ roomName });
  return await newRoom.save();
};

export const roomExists = async (roomName: string): Promise<boolean> => {
  console.log(`in rooms service layer in roomExists method - Checking if room name exists: "${roomName}" (case-insensitive)`);
  const count = await RoomModel.countDocuments({ roomName: { $regex: new RegExp(`^${roomName}$`, 'i') } });
  const exists = count > 0;
  console.log(`in rooms service layer in roomExists method - Result for "${roomName}": exists = ${exists}`);
  return exists;
};
