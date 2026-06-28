import { Request, Response, NextFunction } from 'express';
import * as roomService from '../services/room.service';

export const getRooms = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const rooms = await roomService.getAllRooms();
    res.status(200).json(rooms);
  } catch (error) {
    next(error);
  }
};

export const getRoomById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const room = await roomService.getRoomById(id);
    if (!room) {
      res.status(404).json({ message: 'Room not found' });
      return;
    }
    res.status(200).json(room);
  } catch (error) {
    next(error);
  }
};

export const createRoom = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { roomName } = req.body;
    if (!roomName || typeof roomName !== 'string' || roomName.trim().length < 3 || roomName.trim().length > 30) {
      res.status(400).json({ message: 'Room name must be between 3 and 30 characters' });
      return;
    }
    
    const exists = await roomService.roomExists(roomName);
    if (exists) {
      res.status(400).json({ message: 'Room name already exists' });
      return;
    }

    const room = await roomService.createRoom(roomName.trim());
    res.status(201).json(room);
  } catch (error) {
    next(error);
  }
};
