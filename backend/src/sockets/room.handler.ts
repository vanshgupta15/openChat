import { Socket, Server } from 'socket.io';
import * as socketService from '../services/socket.service';
import * as userHandler from './user.handler';
import { JoinRoomPayload } from '../types/socket.types';

export const joinRoom = (socket: Socket, io: Server, data: JoinRoomPayload): void => {
  const { username, roomId } = data;
  console.log(`in room handler in joinRoom method - User "${username}" joining room: ${roomId}`);
  
  // Join the user in the service (which updates user state)
  socketService.joinUser(socket.id, username, roomId);
  
  // Connect the socket to the room
  socket.join(roomId);
  
  // Broadcast "user-joined" notification to others in the room
  socket.to(roomId).emit('user-joined', {
    username,
    message: `${username} joined the room`,
    timestamp: new Date()
  });
  
  // Broadcast updated user list to everyone in the room
  userHandler.broadcastOnlineUsers(io, roomId);
  
  // Broadcast online counts of all rooms to everyone
  broadcastRoomUpdate(io, roomId);
  
  // Send the initial counts for all rooms to the client that just joined
  sendAllRoomCounts(socket);
};

export const leaveRoom = (socket: Socket, io: Server, data: { username: string; roomId: string }): void => {
  const { username, roomId } = data;
  console.log(`in room handler in leaveRoom method - User "${username}" leaving room: ${roomId}`);
  
  // Remove user from the service
  socketService.leaveUser(socket.id);
  
  // Leave the socket room
  socket.leave(roomId);
  
  // Broadcast "user-left" to others in the room
  socket.to(roomId).emit('user-left', {
    username,
    message: `${username} left the room`,
    timestamp: new Date()
  });
  
  // Broadcast updated user list to everyone in the room
  userHandler.broadcastOnlineUsers(io, roomId);
  
  // Broadcast room count update
  broadcastRoomUpdate(io, roomId);
};

export const broadcastRoomUpdate = (io: Server, roomId: string): void => {
  const users = socketService.getRoomUsers(roomId);
  console.log(`in room handler in broadcastRoomUpdate method - Broadcasting count update for room: ${roomId}. Count: ${users.length}`);
  // Emit a room-update event so all clients update their sidebar room list online count
  io.emit('room-online-count', { roomId, count: users.length });
};

export const sendAllRoomCounts = (socket: Socket): void => {
  console.log(`in room handler in sendAllRoomCounts method - Sending all room counts to socket: ${socket.id}`);
  const counts = userHandler.getAllRoomCounts();
  socket.emit('all-room-counts', counts);
};
