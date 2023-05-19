import { Router } from 'express';

import models from '../../models';

import JwtUtils from '../../utils/jwt.utils';

import asyncWrapper from '../../utils/asyncWrapper.utils';

const router = Router();

const { User, Role, sequelize, RefreshToken } = models;

router.post(
  '/register',
  asyncWrapper(async (req, res) => {
    const { email, password, roles } = req.body;
    // Verify if there is no existing user
    const foundUser = await User.findOne({ where: { email } });
    if (foundUser) return res.status(409).json({ success: false, message: 'User already exists' });
    const result = await User.createUser({ email, password, roles });
    const { accessToken, refreshToken } = result;

    return res.status(201).json({
      success: true,
      message: 'User successfully created',
      data: {
        accessToken,
        refreshToken,
      },
    });
  })
);

export default router;
