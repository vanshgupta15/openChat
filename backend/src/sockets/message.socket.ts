import { Socket, Server } from 'socket.io';
import * as socketService from '../services/socket.service';

export const handleMessage = async (socket: Socket, io: Server, data: { roomId: string; message: string }): Promise<void> => {
  const { roomId, message } = data;
  const user = socket.data.user;
  
  if (!user) {
    console.warn(`in message socket in handleMessage method - No authenticated user found on socket ${socket.id}`);
    socket.emit('error', { message: 'Authentication required' });
    return;
  }
  
  try {
    const { uid: userId, displayName, photoURL } = user;
    const savedMsg = await socketService.saveMessage(roomId, userId, displayName, photoURL, message);
    
    // Broadcast saved message to everyone in the room (including sender)
    broadcastMessage(io, roomId, savedMsg);
  } catch (error) {
    console.error('in message socket in handleMessage method - Error handling sendMessage:', error);
    socket.emit('error', { message: 'Failed to send message' });
  }
};

export const broadcastMessage = (io: Server, roomId: string, message: any): void => {
  console.log(`in message socket in broadcastMessage method - Broadcasting message to room: ${roomId}`);
  io.to(roomId).emit('receive-message', message);
};
