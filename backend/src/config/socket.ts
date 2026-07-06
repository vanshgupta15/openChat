import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import * as authService from '../services/auth.service';

let io: Server | null = null;

export const initializeSocket = (server: HttpServer): Server => {
  console.log('in socket config layer in initializeSocket method - Initializing Socket.IO server...');
  io = new Server(server, {
    cors: {
      origin: '*', // Adjust this to match your frontend URL if needed
      methods: ['GET', 'POST'],
    },
  });

  // Socket.IO middleware for authentication
  io.use(async (socket, next) => {
    const token = socket.handshake.auth?.token;
    console.log(`in socket config layer - Authenticating socket connection: ${socket.id}`);
    
    if (!token) {
      console.warn(`in socket config layer - Authentication failed: Token is missing.`);
      return next(new Error('Authentication error: Token is required'));
    }

    try {
      const decoded = await authService.verifyIdToken(token);
      const user = authService.extractUser(decoded);
      socket.data.user = user;
      console.log(`in socket config layer - Socket connection authenticated for UID: ${user.uid}`);
      next();
    } catch (error) {
      console.error(`in socket config layer - Token verification failed for socket: ${socket.id}:`, error);
      return next(new Error('Authentication error: Invalid token'));
    }
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
