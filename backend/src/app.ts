import express from 'express';
import cors from 'cors';
import { logger } from './middleware/logger.middleware';
import { notFound } from './middleware/notFound.middleware';
import { errorHandler } from './middleware/error.middleware';
import roomRoutes from './routes/room.routes';
import messageRoutes from './routes/message.routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

// Mount API routes
app.use('/api/rooms', roomRoutes);
app.use('/api/messages', messageRoutes);

// Fallbacks
app.use(notFound);
app.use(errorHandler);

export default app;
