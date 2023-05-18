import { Router } from 'express';

import models from '../../models';

import JwtUtils from '../../utils/jwt.utils';

import asyncWrapper from '../../utils/asyncWrapper.utils';

const router = Router();

const { User, RefreshToken } = models;

router.post(
  '/login',
  asyncWrapper(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email }, include: RefreshToken });

    if (!user || !(await User.comparePassword(password, user.password)))
      return res.status(400).json({ success: false, messge: 'Invalid login credentials' });

    // Generate access and request tokens
    const payload = { email };
    const accessToken = JwtUtils.generateAccessToken(payload);

    const savedRefreshToken = await user.getRefreshToken();

    let refreshToken;

    if (!savedRefreshToken || !savedRefreshToken.token) {
      refreshToken = JwtUtils.generateRefreshToken(payload);
      if (!savedRefreshToken) {
        // if the refresh token doesnt exist create a new refreshToken
        await user.createRefreshToken({ token: refreshToken });
      } else {
        // if the refresh token is empty or null set the newly created refreshToken as the presisted token prop
        user.RefreshToken.token = refreshToken;

        // save the refreshToken
        await user.RefreshToken.save();
      }
    } else {
      // if the refresh token exists get the token property from the saved object
      refreshToken = savedRefreshToken.token;
    }
    return res
      .status(200)
      .json({ success: true, message: 'User successfully logged in', data: { accessToken, refreshToken } });
  })
);

export default router;
