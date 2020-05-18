// 不需要csrf和auth的路由
import { Router } from 'express';
import user from './user';
import common from './common';
import upload from './upload';
import wx from './wx';
const router = Router();
router.get('/', function(req, res) {
  res.render('index', { title: 'Vue' });
});
router.use('/user', user);
router.use('/common', common);
router.use('/upload', upload);
router.use('/wx', wx);
export default router;
