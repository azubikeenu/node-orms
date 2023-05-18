import { Router } from 'express';
import registerRouter from './register';
import loginRouter from './login';
import tokenRouter from './token';

const router = Router();

const routers = [loginRouter, registerRouter, tokenRouter];

routers.forEach((r) => {
  router.use(r);
});

export default router;
