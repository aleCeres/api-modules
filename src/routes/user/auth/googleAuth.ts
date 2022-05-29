import {
  Router, Request, Response, NextFunction,
} from 'express';
import { getAuthToken } from '../../../utils/jwt';
import { getUserByToken } from '../../../lib/google';
import { HttpCustomError, ValidationError } from '../../../errors';
import { upsert } from '../../../repository/user';
import { validateGoogleAuth } from '../../../validator/user/googleAuth';

export const googleAuthRouter = Router();

googleAuthRouter.post('/google', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token: googleToken } = await validateGoogleAuth(req);
    const formattedPayload = await getUserByToken(googleToken);
    const userId = await upsert(formattedPayload);
    const token = getAuthToken(userId);
    res.status(200).json({ token });
  } catch (error) {
    if (error instanceof ValidationError) {
      next(new HttpCustomError('validation error', 400, error));
    }
    next(new HttpCustomError('unknown error', 500, error));
  }
});
