import { Socket, Server } from 'socket.io';
import * as socketService from '../services/socket.service';
import * as userSocket from './user.socket';

export const joinRoom = (socket: Socket, io: Server, data: { roomId: string }): void => {
  const { roomId } = data;
  const user = socket.data.user;
  
  if (!user) {
    console.warn(`in room socket in joinRoom method - No authenticated user found on socket ${socket.id}`);
    return;
  }
  
  const { uid: userId, displayName, photoURL } = user;
  console.log(`in room socket in joinRoom method - User "${displayName}" (UID: ${userId}) joining room: ${roomId}`);
  
  // Join the user in the service (which updates user state)
  socketService.joinUser(socket.id, userId, displayName, photoURL, roomId);
  
  // Connect the socket to the room
  socket.join(roomId);
  
  // Broadcast user-joined notification
  userSocket.notifyUserJoined(socket, io, displayName, roomId);
  
  // Broadcast updated user list to everyone in the room
  userSocket.updateOnlineUsers(io, roomId);
  
  // Broadcast online counts of all rooms to everyone
  broadcastRoomUpdate(io, roomId);
  
  // Send the initial counts for all rooms to the client that just joined
  sendAllRoomCounts(socket);
};

export const leaveRoom = (socket: Socket, io: Server, data: { roomId: string }): void => {
  const { roomId } = data;
  const user = socket.data.user;
  
  if (!user) {
    console.warn(`in room socket in leaveRoom method - No authenticated user found on socket ${socket.id}`);
    return;
  }
  
  const { displayName } = user;
  console.log(`in room socket in leaveRoom method - User "${displayName}" leaving room: ${roomId}`);
  
  // Remove user from the service
  socketService.leaveUser(socket.id);
  
  // Leave the socket room
  socket.leave(roomId);
  
  // Broadcast user-left notification
  userSocket.notifyUserLeft(socket, io, displayName, roomId);
  
  // Broadcast updated user list to everyone in the room
  userSocket.updateOnlineUsers(io, roomId);
  
  // Broadcast room count update
  broadcastRoomUpdate(io, roomId);
};

export const broadcastRoomUpdate = (io: Server, roomId: string): void => {
  const users = socketService.getOnlineUsers(roomId);
  console.log(`in room socket in broadcastRoomUpdate method - Broadcasting count update for room: ${roomId}. Count: ${users.length}`);
  // Emit a room-update event so all clients update their sidebar room list online count
  io.emit('room-online-count', { roomId, count: users.length });
};

export const sendAllRoomCounts = (socket: Socket): void => {
  console.log(`in room socket in sendAllRoomCounts method - Sending all room counts to socket: ${socket.id}`);
  const counts = userSocket.getAllRoomCounts();
  socket.emit('all-room-counts', counts);
};
