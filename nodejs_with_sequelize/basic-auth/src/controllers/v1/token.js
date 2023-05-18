import { Router } from 'express';

import models from '../../models';

import JwtUtils from '../../utils/jwt.utils';

import asyncWrapper from '../../utils/asyncWrapper.utils';

import requireAuth from '../../middlewares/requireAuth.middleware';

const router = Router();

const { User, RefreshToken } = models;

router.post(
  '/token',
  requireAuth('refreshToken'),
  asyncWrapper(async (req, res) => {
    const { jwt } = req.body;
    const user = await User.findOne({ where: { email: jwt.email }, include: RefreshToken });

    const refreshToken = user.RefreshToken;

    if (!refreshToken || !refreshToken.token) {
      return res.status(401).json({ success: false, message: 'Please login to continue' });
    }
    // reIssue AccessToken
    const payload = { email: user.email };
    const accessToken = JwtUtils.generateAccessToken(payload);

    return res.status(200).json({ success: true, data: { accessToken } });
  })
);

export default router;
