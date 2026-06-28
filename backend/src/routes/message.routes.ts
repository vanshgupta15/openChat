import { Router } from 'express';
import * as messageController from '../controllers/message.controller';

const router = Router();

router.get('/:roomId', messageController.getMessages);
router.post('/', messageController.createMessage);

export default router;
