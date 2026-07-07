import { RoomModel, IRoomDocument } from '../models/room.model';

export const getAllRooms = async (): Promise<IRoomDocument[]> => {
  console.log('in rooms service layer in getAllRooms method - Querying RoomModel for all rooms sorted by name.');
  return await RoomModel.find().sort({ roomName: 1 });
};

export const getRoomById = async (id: string): Promise<IRoomDocument | null> => {
  console.log(`in rooms service layer in getRoomById method - Querying RoomModel for ID: ${id}`);
  return await RoomModel.findById(id);
};

export const createRoom = async (roomName: string, creatorId?: string, password?: string): Promise<IRoomDocument> => {
  console.log(`in rooms service layer in createRoom method - Saving new RoomModel: "${roomName}" with creator: ${creatorId}`);
  const newRoom = new RoomModel({ 
    roomName,
    creatorId,
    password: password || '2222'
  });
  return await newRoom.save();
};

export const roomExists = async (roomName: string): Promise<boolean> => {
  console.log(`in rooms service layer in roomExists method - Checking if room name exists: "${roomName}" (case-insensitive)`);
  const count = await RoomModel.countDocuments({ roomName: { $regex: new RegExp(`^${roomName}$`, 'i') } });
  const exists = count > 0;
  console.log(`in rooms service layer in roomExists method - Result for "${roomName}": exists = ${exists}`);
  return exists;
};

export const verifyRoomPassword = async (roomId: string, passwordAttempt: string): Promise<boolean> => {
  console.log(`in rooms service layer in verifyRoomPassword method - Verifying password for room: ${roomId}`);
  const room = await RoomModel.findById(roomId);
  if (!room) return false;
  const actualPassword = room.password || '2222';
  return actualPassword === passwordAttempt;
};

export const updateRoomPassword = async (roomId: string, creatorId: string, newPassword: string): Promise<IRoomDocument | null> => {
  console.log(`in rooms service layer in updateRoomPassword method - Attempting password update for room: ${roomId} by user: ${creatorId}`);
  const room = await RoomModel.findById(roomId);
  if (!room) {
    throw new Error('Room not found');
  }
  if (room.creatorId !== creatorId) {
    throw new Error('Unauthorized: Only the room creator can change the password');
  }
  room.password = newPassword;
  return await room.save();
};
