import { Server, Socket } from 'socket.io';
import { SocketUser } from '../types/socket.types';

// In-memory store: socketId -> SocketUser
const onlineUsers = new Map<string, SocketUser>();

export const addUser = (socketId: string, userId: string, displayName: string, photoURL: string, roomId: string): SocketUser => {
  console.log(`in user socket in addUser method - Adding user: "${displayName}" in room: ${roomId} with socket: ${socketId}`);
  const user: SocketUser = { socketId, userId, displayName, photoURL, roomId };
  onlineUsers.set(socketId, user);
  return user;
};

export const removeUser = (socketId: string): SocketUser | undefined => {
  const user = onlineUsers.get(socketId);
  if (user) {
    console.log(`in user socket in removeUser method - Removing user: "${user.displayName}" with socket: ${socketId}`);
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

export const getAllRoomCounts = (): { [roomId: string]: number } => {
  const counts: { [roomId: string]: number } = {};
  for (const user of onlineUsers.values()) {
    counts[user.roomId] = (counts[user.roomId] || 0) + 1;
  }
  return counts;
};

export const updateOnlineUsers = (io: Server, roomId: string): void => {
  const users = getOnlineUsers(roomId);
  console.log(`in user socket in updateOnlineUsers method - Broadcasting online users list for room: ${roomId}. Total: ${users.length}`);
  io.to(roomId).emit('online-users', users.map(u => ({
    userId: u.userId,
    displayName: u.displayName,
    photoURL: u.photoURL,
  })));
};

export const notifyUserJoined = (socket: Socket, io: Server, displayName: string, roomId: string): void => {
  console.log(`in user socket in notifyUserJoined method - User "${displayName}" joined room: ${roomId}`);
  socket.to(roomId).emit('user-joined', {
    username: displayName,
    message: `${displayName} joined the room`,
    timestamp: new Date(),
  });
};

export const notifyUserLeft = (socket: Socket, io: Server, displayName: string, roomId: string): void => {
  console.log(`in user socket in notifyUserLeft method - User "${displayName}" left room: ${roomId}`);
  socket.to(roomId).emit('user-left', {
    username: displayName,
    message: `${displayName} left the room`,
    timestamp: new Date(),
  });
};
