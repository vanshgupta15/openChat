import { Server, Socket } from 'socket.io';
import * as roomSocket from './room.socket';
import * as messageSocket from './message.socket';
import * as userSocket from './user.socket';
import * as socketService from '../services/socket.service';

export const handleConnection = (socket: Socket, io: Server): void => {
  console.log(`in connection socket in handleConnection method - Client connected: ${socket.id}`);
  
  socket.on('join-room', (data: { roomId: string }) => {
    roomSocket.joinRoom(socket, io, data);
  });
  
  socket.on('send-message', (data: { roomId: string; message: string }) => {
    messageSocket.handleMessage(socket, io, data);
  });
  
  socket.on('leave-room', (data: { roomId: string }) => {
    roomSocket.leaveRoom(socket, io, data);
  });
  
  socket.on('disconnect', () => {
    handleDisconnect(socket, io);
  });
};

export const handleDisconnect = (socket: Socket, io: Server): void => {
  console.log(`in connection socket in handleDisconnect method - Client disconnected: ${socket.id}`);
  
  const user = socketService.leaveUser(socket.id);
  if (user) {
    const { roomId, displayName } = user;
    console.log(`in connection socket in handleDisconnect method - User "${displayName}" disconnected from room: ${roomId}`);
    
    // Broadcast user-left notification
    userSocket.notifyUserLeft(socket, io, displayName, roomId);
    
    // Broadcast updated user list
    userSocket.updateOnlineUsers(io, roomId);
    
    // Broadcast room count update
    roomSocket.broadcastRoomUpdate(io, roomId);
  }
};
