import { Router } from 'express';

import models from '../../models';

import JwtUtils from '../../utils/jwt.utils';

import asyncWrapper from '../../utils/asyncWrapper.utils';

const router = Router();

const { User, Role, sequelize } = models;

router.post(
  '/register',
  asyncWrapper(async (req, res) => {
    const { email, password, roles } = req.body;
    // Verify if there is no existing user
    const foundUser = await User.findOne({ where: { email } });
    if (foundUser) return res.status(409).json({ success: false, message: 'User already exists' });

    try {
      const result = await sequelize.transaction(async () => {
        const newUser = await User.create({ email, password });
        const payload = { email };
        // Generate an access token
        const accessToken = JwtUtils.generateAccessToken(payload);
        // Generate a refresh token
        const refreshToken = JwtUtils.generateRefreshToken(payload);
        // Create a refresh token
        await newUser.createRefreshToken({ token: refreshToken });

        // Create Roles
        if (roles && Array.isArray(roles)) {
          const rolesToSave = [];

          for (let role of roles) {
            const newRole = await Role.create({ role });
            rolesToSave.push(newRole);
          }
          // Add roles to user
          await newUser.addRoles(rolesToSave);
        }
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
    } catch (err) {
      return res.status(500).json({ success: false, message: `Error creating user : ${err?.message}` });
    }
  })
);

export default router;
