import { Request, Response, NextFunction } from 'express';
import * as messageService from '../services/message.service';
import * as roomService from '../services/room.service';

export const getMessages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { roomId } = req.params;
  console.log(`in messages controller layer in getMessages method - Request received to get messages for roomId: ${roomId}`);
  try {
    // Check if room exists
    const room = await roomService.getRoomById(roomId);
    if (!room) {
      console.warn(`in messages controller layer in getMessages method - Room with ID: ${roomId} not found.`);
      res.status(404).json({ message: 'Room not found' });
      return;
    }

    const messages = await messageService.getMessagesByRoom(roomId);
    console.log(`in messages controller layer in getMessages method - Found ${messages.length} messages for roomId: ${roomId}`);
    res.status(200).json(messages);
  } catch (error) {
    console.error(`in messages controller layer in getMessages method - Error fetching messages for roomId ${roomId}:`, error);
    next(error);
  }
};

export const createMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { roomId, message } = req.body;
  const user = (req as any).user;
  
  if (!user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  
  const { uid: userId, displayName, photoURL } = user;
  console.log(`in messages controller layer in createMessage method - Request received to post message in roomId: ${roomId} by user: "${displayName}"`);
  
  try {
    if (!roomId || !message) {
      console.warn('in messages controller layer in createMessage method - Validation failed: roomId and message are required.');
      res.status(400).json({ message: 'roomId and message are required' });
      return;
    }

    // Check if room exists
    const room = await roomService.getRoomById(roomId);
    if (!room) {
      console.warn(`in messages controller layer in createMessage method - Room with ID: ${roomId} not found.`);
      res.status(404).json({ message: 'Room not found' });
      return;
    }

    const savedMessage = await messageService.saveMessage(roomId, userId, displayName, photoURL, message);
    console.log(`in messages controller layer in createMessage method - Message successfully saved with ID: ${savedMessage._id} in roomId: ${roomId}`);
    res.status(201).json(savedMessage);
  } catch (error) {
    console.error('in messages controller layer in createMessage method - Error creating message:', error);
    next(error);
  }
};
