import express, { Router } from 'express';
import UserController from '../controllers/user.controller';

const router: Router = express.Router();

router.route('/').get(UserController.listAll);
export default router;
