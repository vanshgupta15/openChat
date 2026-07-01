import * as messageService from './message.service';
import * as userHandler from '../sockets/user.handler';
import { SocketUser } from '../types/socket.types';

export const saveMessage = async (roomId: string, username: string, message: string) => {
  console.log(`in socket service in saveMessage method - Saving message from "${username}" in room: ${roomId}`);
  return await messageService.saveMessage(roomId, username, message);
};

export const joinUser = (socketId: string, username: string, roomId: string): SocketUser => {
  console.log(`in socket service in joinUser method - Joining user "${username}" to room: ${roomId}`);
  return userHandler.addUser(socketId, username, roomId);
};

export const leaveUser = (socketId: string): SocketUser | undefined => {
  console.log(`in socket service in leaveUser method - Leaving user with socketId: ${socketId}`);
  return userHandler.removeUser(socketId);
};

export const getRoomUsers = (roomId: string): SocketUser[] => {
  return userHandler.getOnlineUsers(roomId);
};
