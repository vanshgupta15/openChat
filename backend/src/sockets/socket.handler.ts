import { Server, Socket } from 'socket.io';
import * as roomHandler from './room.handler';
import * as messageHandler from './message.handler';
import * as userHandler from './user.handler';
import * as socketService from '../services/socket.service';

export const handleConnection = (socket: Socket, io: Server): void => {
  console.log(`in socket handler in handleConnection method - Client connected: ${socket.id}`);
  
  // Register events
  socket.on('join-room', (data: { username: string; roomId: string }) => {
    roomHandler.joinRoom(socket, io, data);
  });
  
  socket.on('send-message', (data: { roomId: string; username: string; message: string }) => {
    messageHandler.sendMessage(socket, io, data);
  });
  
  socket.on('leave-room', (data: { username: string; roomId: string }) => {
    roomHandler.leaveRoom(socket, io, data);
  });
  
  socket.on('disconnect', () => {
    handleDisconnect(socket, io);
  });
};

export const handleDisconnect = (socket: Socket, io: Server): void => {
  console.log(`in socket handler in handleDisconnect method - Client disconnected: ${socket.id}`);
  
  // Get user details before removing
  const user = socketService.leaveUser(socket.id);
  if (user) {
    const { roomId, username } = user;
    console.log(`in socket handler in handleDisconnect method - User "${username}" disconnected from room: ${roomId}`);
    
    // Broadcast user-left notification
    socket.to(roomId).emit('user-left', {
      username,
      message: `${username} left the room`,
      timestamp: new Date()
    });
    
    // Broadcast updated user list
    userHandler.broadcastOnlineUsers(io, roomId);
    
    // Broadcast room count update
    roomHandler.broadcastRoomUpdate(io, roomId);
  }
};
