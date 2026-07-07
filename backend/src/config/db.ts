import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/openchat';
  console.log(`in db config layer in connectDB method - Attempting to connect to MongoDB at: ${mongoUri}`);
  try {
    await mongoose.connect(mongoUri);
    console.log('in db config layer in connectDB method - MongoDB connected successfully.');
  } catch (error) {
    console.error('in db config layer in connectDB method - MongoDB connection error:', error);
    process.exit(1);
  }
};
