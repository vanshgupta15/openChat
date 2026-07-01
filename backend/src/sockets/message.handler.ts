import { Socket, Server } from 'socket.io';
import * as socketService from '../services/socket.service';
import { SendMessagePayload } from '../types/socket.types';

export const sendMessage = async (socket: Socket, io: Server, data: SendMessagePayload): Promise<void> => {
  const { roomId, username, message } = data;
  console.log(`in message handler in sendMessage method - Message from "${username}" in room: ${roomId}`);
  
  try {
    // Save message to database
    const savedMsg = await socketService.saveMessage(roomId, username, message);
    
    // Broadcast saved message to everyone in the room (including sender)
    broadcastMessage(io, roomId, savedMsg);
  } catch (error) {
    console.error('in message handler in sendMessage method - Error handling sendMessage:', error);
    socket.emit('error', { message: 'Failed to send message' });
  }
};

export const broadcastMessage = (io: Server, roomId: string, message: any): void => {
  console.log(`in message handler in broadcastMessage method - Broadcasting message to room: ${roomId}`);
  io.to(roomId).emit('receive-message', message);
};

export const loadHistory = async (socket: Socket, roomId: string): Promise<void> => {
  console.log(`in message handler in loadHistory method - Client requested history for room: ${roomId}`);
  // History is loaded via REST as specified. This function can be kept as a placeholder/no-op.
};
