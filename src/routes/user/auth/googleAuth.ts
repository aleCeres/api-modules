import {
  Router, Request, Response, NextFunction,
} from 'express';
import { OAuth2Client } from 'google-auth-library';
import { validateGoogleAuth } from '../../../validator/user/googleAuth';
import { HttpCustomError, ValidationError } from '../../../errors';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
export const googleAuthRouter = Router();

googleAuthRouter.post('/google', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = await validateGoogleAuth(req);
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    res.status(201).json({ payload });
  } catch (error) {
    if (error instanceof ValidationError) {
      next(new HttpCustomError('validation error', 400, error));
    }
    next(new HttpCustomError('unknown error', 500, error));
  }
});
