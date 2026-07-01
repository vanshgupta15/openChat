import { Server } from 'socket.io';
import { SocketUser } from '../types/socket.types';

// In-memory store: socketId -> SocketUser
const onlineUsers = new Map<string, SocketUser>();

export const addUser = (socketId: string, username: string, roomId: string): SocketUser => {
  console.log(`in user handler in addUser method - Adding user: "${username}" in room: ${roomId} with socket: ${socketId}`);
  const user: SocketUser = { socketId, username, roomId };
  onlineUsers.set(socketId, user);
  return user;
};

export const removeUser = (socketId: string): SocketUser | undefined => {
  const user = onlineUsers.get(socketId);
  if (user) {
    console.log(`in user handler in removeUser method - Removing user: "${user.username}" with socket: ${socketId}`);
    onlineUsers.delete(socketId);
  }
  return user;
};

export const getOnlineUsers = (roomId: string): SocketUser[] => {
  const usersInRoom: SocketUser[] = [];
  for (const user of onlineUsers.values()) {
    if (user.roomId === roomId) {
      usersInRoom.push(user);
    }
  }
  return usersInRoom;
};

export const broadcastOnlineUsers = (io: Server, roomId: string): void => {
  const users = getOnlineUsers(roomId);
  console.log(`in user handler in broadcastOnlineUsers method - Broadcasting online users list for room: ${roomId}. Total: ${users.length}`);
  io.to(roomId).emit('online-users', users);
};

export const getAllRoomCounts = (): { [roomId: string]: number } => {
  const counts: { [roomId: string]: number } = {};
  for (const user of onlineUsers.values()) {
    counts[user.roomId] = (counts[user.roomId] || 0) + 1;
  }
  return counts;
};
