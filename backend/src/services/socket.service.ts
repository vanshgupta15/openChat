import * as messageService from './message.service';
import * as userSocket from '../sockets/user.socket';
import { SocketUser } from '../types/socket.types';
import { Server } from 'socket.io';

export const saveMessage = async (
  roomId: string,
  userId: string,
  displayName: string,
  photoURL: string,
  message: string
) => {
  console.log(`in socket service in saveMessage method - Saving message from "${displayName}" in room: ${roomId}`);
  return await messageService.saveMessage(roomId, userId, displayName, photoURL, message);
};

export const joinUser = (
  socketId: string,
  userId: string,
  displayName: string,
  photoURL: string,
  roomId: string
): SocketUser => {
  console.log(`in socket service in joinUser method - Joining user "${displayName}" to room: ${roomId}`);
  return userSocket.addUser(socketId, userId, displayName, photoURL, roomId);
};

export const leaveUser = (socketId: string): SocketUser | undefined => {
  console.log(`in socket service in leaveUser method - Leaving user with socketId: ${socketId}`);
  return userSocket.removeUser(socketId);
};

export const getOnlineUsers = (roomId: string): SocketUser[] => {
  return userSocket.getOnlineUsers(roomId);
};

export const broadcastUsers = (io: Server, roomId: string): void => {
  userSocket.updateOnlineUsers(io, roomId);
};

export const broadcastMessage = (io: Server, roomId: string, message: any): void => {
  io.to(roomId).emit('receive-message', message);
};
