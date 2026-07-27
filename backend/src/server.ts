import dotenv from 'dotenv';
import path from 'path';
import dns from 'dns';

// Force Node to resolve DNS using IPv4 first to prevent Atlas SRV resolution issues
dns.setDefaultResultOrder('ipv4first');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

import app from './app';
import { connectDB } from './config/db';
import http from 'http';
import { initializeSocket } from './config/socket';
import { handleConnection } from './sockets/connection.socket';
import { initializeFirebase } from './config/firebase';

const startServer = async (): Promise<void> => {
  console.log('in server initialization in startServer method - Starting server initialization sequence...');
  initializeFirebase();
  await connectDB();
  
  
  const port = process.env.PORT || 5000;
  const server = http.createServer(app);
  const io = initializeSocket(server);

  io.on('connection', (socket) => {
    handleConnection(socket, io);
  });

  server.listen(port, () => {
    console.log(`in server initialization in startServer method - Server (with Socket.IO) is running in dev mode on port ${port}`);
  });
};

startServer();
