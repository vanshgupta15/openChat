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

const seedDefaultRooms = async (): Promise<void> => {
  try {
    const count = await RoomModel.countDocuments();
    if (count === 0) {
      console.log('Seeding default chat rooms...');
      const defaultRooms = ['General', 'JavaScript', 'Movies', 'Sports'];
      await RoomModel.insertMany(defaultRooms.map(roomName => ({ roomName })));
      console.log('Default chat rooms seeded successfully.');
    }
  } catch (error) {
    console.error('Error seeding default rooms:', error);
  }
};

const startServer = async (): Promise<void> => {
  await connectDB();
  await seedDefaultRooms();
  
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Server is running in dev mode on port ${port}`);
  });
};

startServer();
