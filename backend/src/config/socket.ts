import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';

let io: Server | null = null;

export const initializeSocket = (server: HttpServer): Server => {
  console.log('in socket config layer in initializeSocket method - Initializing Socket.IO server...');
  io = new Server(server, {
    cors: {
      origin: '*', // Adjust this to match your frontend URL if needed
      methods: ['GET', 'POST'],
    },
  });
  return io;
};

export const getIO = (): Server => {
  if (!io) {
    console.error('in socket config layer in getIO method - Socket.IO has not been initialized!');
    throw new Error('Socket.io has not been initialized');
  }
  return io;
};
