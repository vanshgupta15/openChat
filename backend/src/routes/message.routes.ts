import { Router } from 'express';
import * as messageController from '../controllers/message.controller';
import { verifyFirebaseToken } from '../middleware/auth.middleware';

const router = Router();

router.get('/:roomId', verifyFirebaseToken, messageController.getMessages);
router.post('/', verifyFirebaseToken, messageController.createMessage);

export default router;
