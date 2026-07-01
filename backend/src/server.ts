import dotenv from 'dotenv';
import path from 'path';
import dns from 'dns';

// Force Node to resolve DNS using IPv4 first to prevent Atlas SRV resolution issues
dns.setDefaultResultOrder('ipv4first');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

import app from './app';
import { connectDB } from './config/db';
import { RoomModel } from './models/room.model';
import http from 'http';
import { initializeSocket } from './config/socket';
import { handleConnection } from './sockets/socket.handler';

const seedDefaultRooms = async (): Promise<void> => {
  console.log('in server initialization in seedDefaultRooms method - Checking if default rooms need to be seeded...');
  try {
    const count = await RoomModel.countDocuments();
    console.log(`in server initialization in seedDefaultRooms method - Found ${count} existing rooms.`);
    if (count === 0) {
      console.log('in server initialization in seedDefaultRooms method - Seeding default chat rooms...');
      const defaultRooms = ['General', 'JavaScript', 'Movies', 'Sports'];
      await RoomModel.insertMany(defaultRooms.map(roomName => ({ roomName })));
      console.log('in server initialization in seedDefaultRooms method - Default chat rooms seeded successfully.');
    } else {
      console.log('in server initialization in seedDefaultRooms method - Rooms already seeded. Skipping.');
    }
  } catch (error) {
    console.error('in server initialization in seedDefaultRooms method - Error seeding default rooms:', error);
  }
};

const startServer = async (): Promise<void> => {
  console.log('in server initialization in startServer method - Starting server initialization sequence...');
  await connectDB();
  await seedDefaultRooms();
  
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
