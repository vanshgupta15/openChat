import { Router } from 'express';
import * as roomController from '../controllers/room.controller';
import { verifyFirebaseToken } from '../middleware/auth.middleware';

const router = Router();

router.get('/', verifyFirebaseToken, roomController.getRooms);
router.post('/', verifyFirebaseToken, roomController.createRoom);
router.get('/:id', verifyFirebaseToken, roomController.getRoomById);

export default router;
