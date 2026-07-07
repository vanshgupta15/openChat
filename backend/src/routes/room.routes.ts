import { Router } from 'express';
import * as roomController from '../controllers/room.controller';
import { verifyFirebaseToken } from '../middleware/auth.middleware';

const router = Router();

router.get('/', verifyFirebaseToken, roomController.getRooms);
router.post('/', verifyFirebaseToken, roomController.createRoom);
router.get('/:id', verifyFirebaseToken, roomController.getRoomById);
router.post('/:id/verify', verifyFirebaseToken, roomController.verifyRoomPassword);
router.put('/:id/password', verifyFirebaseToken, roomController.updateRoomPassword);

export default router;
