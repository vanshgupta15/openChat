import { Request, Response, NextFunction } from 'express';
import * as messageService from '../services/message.service';
import * as roomService from '../services/room.service';

export const getMessages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { roomId } = req.params;
    
    // Check if room exists
    const room = await roomService.getRoomById(roomId);
    if (!room) {
      res.status(404).json({ message: 'Room not found' });
      return;
    }

    const messages = await messageService.getMessagesByRoom(roomId);
    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};

export const createMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { roomId, username, message } = req.body;
    
    if (!roomId || !username || !message) {
      res.status(400).json({ message: 'roomId, username, and message are required' });
      return;
    }

    // Check if room exists
    const room = await roomService.getRoomById(roomId);
    if (!room) {
      res.status(404).json({ message: 'Room not found' });
      return;
    }

    const savedMessage = await messageService.saveMessage(roomId, username, message);
    res.status(201).json(savedMessage);
  } catch (error) {
    next(error);
  }
};
