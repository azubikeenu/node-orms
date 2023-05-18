import { Router } from 'express';
import registerRouter from './register';
import loginRouter from './login';

const router = Router();

const routers = [loginRouter, registerRouter];

routers.forEach((r) => {
  router.use(r);
});

export default router;
