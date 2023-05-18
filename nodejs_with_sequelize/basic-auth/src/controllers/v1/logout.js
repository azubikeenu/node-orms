import { Router } from 'express';

import models from '../../models';

import JwtUtils from '../../utils/jwt.utils';

import asyncWrapper from '../../utils/asyncWrapper.utils';

import requireAuth from '../../middlewares/requireAuth.middleware';

const router = Router();

const { User, RefreshToken } = models;

router.post(
  '/logout',
  requireAuth(),
  asyncWrapper(async (req, res) => {
    const { email } = req.body.jwt;
    const user = await User.findOne({ where: { email }, include: RefreshToken });

    user.RefreshToken.token = null;
    await user.RefreshToken.save();

    return res.status(200).json({ success: true, message: 'Successfully logged out' });
  })
);

export default router;
