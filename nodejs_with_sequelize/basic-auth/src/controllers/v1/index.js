import { Router } from 'express';
import registerRouter from './register';
import loginRouter from './login';
import tokenRouter from './token';
import logoutRouter from './logout';

const router = Router();

const routers = [loginRouter, registerRouter, tokenRouter, logoutRouter];

routers.forEach((r) => {
  router.use(r);
});

export default router;
