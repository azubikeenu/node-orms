import express, { Router } from 'express';
import UserController from '../controllers/user.controller';

const router: Router = express.Router();

router.route('/').get(UserController.listAll).post(UserController.createUser);
router.route('/:id').get(UserController.findUser);
export default router;
