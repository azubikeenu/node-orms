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

    const result = await sequelize.transaction(async () => {
      const payload = { email };

      // Generate an access token
      const accessToken = JwtUtils.generateAccessToken(payload);
      // Generate a refresh token
      const refreshToken = JwtUtils.generateRefreshToken(payload);
      // Create Roles
      let rolesToSave = [];
      if (roles && Array.isArray(roles)) {
        rolesToSave = roles.map((role) => ({ role }));
      }

      //create user with assc

      await User.create(
        {
          email,
          password,
          Roles: rolesToSave,
          RefreshToken: { token: refreshToken },
        },
        { include: [Role, RefreshToken] }
      );
      return { accessToken, refreshToken };
    });

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
