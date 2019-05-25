import { Router } from 'express';
const router = Router();

router.post('/GetUserInfo', function(req, res /* next */) {
  res.json({ IsSuccess: true, Data: 'GetUserInfo', ErrorMsg: `` });
});

export default router;
