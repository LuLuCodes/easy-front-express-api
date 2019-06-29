// 不需要csrf和auth的路由
import { Router } from 'express';
import user from './user';
import common from './common';
const router = Router();

router.use('/user', user);
router.use('/common', common);
export default router;
