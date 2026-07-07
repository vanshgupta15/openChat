import { Request, Response, NextFunction } from 'express';
import * as roomService from '../services/room.service';

export const getRooms = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  console.log('in rooms controller layer in getRooms method - Request received to fetch all rooms.');
  try {
    const rooms = await roomService.getAllRooms();
    console.log(`in rooms controller layer in getRooms method - Successfully retrieved ${rooms.length} rooms.`);
    res.status(200).json(rooms);
  } catch (error) {
    console.error('in rooms controller layer in getRooms method - Error occurred:', error);
    next(error);
  }
};

export const getRoomById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  console.log(`in rooms controller layer in getRoomById method - Request received to fetch room with ID: ${id}`);
  try {
    const room = await roomService.getRoomById(id);
    if (!room) {
      console.warn(`in rooms controller layer in getRoomById method - Room with ID: ${id} not found.`);
      res.status(404).json({ message: 'Room not found' });
      return;
    }
    console.log(`in rooms controller layer in getRoomById method - Successfully retrieved room: ${room.roomName}`);
    res.status(200).json(room);
  } catch (error) {
    console.error(`in rooms controller layer in getRoomById method - Error occurred for room ID ${id}:`, error);
    next(error);
  }
};

export const createRoom = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { roomName, password } = req.body;
  const creatorId = (req as any).user?.uid;
  console.log(`in rooms controller layer in createRoom method - Request received to create room with name: "${roomName}" by creator: ${creatorId}`);
  try {
    if (!roomName || typeof roomName !== 'string' || roomName.trim().length < 3 || roomName.trim().length > 30) {
      console.warn(`in rooms controller layer in createRoom method - Validation failed: Room name "${roomName}" must be between 3 and 30 characters.`);
      res.status(400).json({ message: 'Room name must be between 3 and 30 characters' });
      return;
    }
    
    const exists = await roomService.roomExists(roomName);
    if (exists) {
      console.warn(`in rooms controller layer in createRoom method - Room name "${roomName}" already exists.`);
      res.status(400).json({ message: 'Room name already exists' });
      return;
    }

    const room = await roomService.createRoom(roomName.trim(), creatorId, password);
    console.log(`in rooms controller layer in createRoom method - Successfully created room with ID: ${room._id} and name: "${room.roomName}"`);
    res.status(201).json(room);
  } catch (error) {
    console.error(`in rooms controller layer in createRoom method - Error occurred creating room "${roomName}":`, error);
    next(error);
  }
};

export const verifyRoomPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  const { password } = req.body;
  console.log(`in rooms controller layer in verifyRoomPassword method - Verifying password for room: ${id}`);
  try {
    if (!password) {
      res.status(400).json({ message: 'Password is required' });
      return;
    }
    const isCorrect = await roomService.verifyRoomPassword(id, password);
    if (isCorrect) {
      res.status(200).json({ success: true, message: 'Password verified successfully' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid password' });
    }
  } catch (error) {
    console.error(`in rooms controller layer in verifyRoomPassword method - Error:`, error);
    next(error);
  }
};

export const updateRoomPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  const { password } = req.body;
  const creatorId = (req as any).user?.uid;
  console.log(`in rooms controller layer in updateRoomPassword method - Updating password for room: ${id} by user: ${creatorId}`);
  try {
    if (!password || typeof password !== 'string' || password.trim().length === 0) {
      res.status(400).json({ message: 'Invalid new password' });
      return;
    }
    if (!creatorId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const updatedRoom = await roomService.updateRoomPassword(id, creatorId, password.trim());
    res.status(200).json({ success: true, message: 'Password updated successfully', room: updatedRoom });
  } catch (error: any) {
    console.error(`in rooms controller layer in updateRoomPassword method - Error:`, error);
    if (error.message.includes('Unauthorized')) {
      res.status(403).json({ message: error.message });
    } else {
      res.status(404).json({ message: error.message });
    }
  }
};
