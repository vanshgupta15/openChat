import { Router } from 'express';
import * as roomController from '../controllers/room.controller';

const router = Router();

router.get('/', roomController.getRooms);
router.post('/', roomController.createRoom);
router.get('/:id', roomController.getRoomById);

export default router;
