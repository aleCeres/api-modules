import {
  Router, Request, Response, NextFunction,
} from 'express';
import * as argon2 from 'argon2';

import { getAuthToken } from '../../utils/jwt';
import { validateLogin } from '../../validator/user/login';
import {
  UnAuthorizedError,
  HttpCustomError, ValidationError, ConflictResourceError, NotFoundError,
} from '../../errors';
import { getByEmail, upsert } from '../../repository/user';
import { validateSignup } from '../../validator/user/signup';

export const usersRouter = Router();

usersRouter.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      email,
      password,
      first_name,
      last_name,
    } = await validateSignup(req);

    const userWithSameEmail = await getByEmail(email);
    if (userWithSameEmail) {
      throw new ConflictResourceError('user with same email already exists');
    }
    await upsert({
      email,
      password,
      first_name,
      last_name,
      signup_kind: 'with_password',
    });

    res.status(201).json({});
  } catch (error) {
    if (error instanceof ValidationError) {
      next(new HttpCustomError('validation error', 400, error));
    }
    if (error instanceof ConflictResourceError) {
      next(new HttpCustomError('conflict resource', 409, error));
    }
    next(new HttpCustomError('unknown error', 500, error));
  }
});

usersRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      email,
      password,
    } = await validateLogin(req);

    const user = await getByEmail(email);

    if (!user) {
      throw new NotFoundError('user not found');
    }
    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      throw new UnAuthorizedError('invalid password');
    }
    const token = getAuthToken(user.id);

    res.status(200).json({ token });
  } catch (error) {
    if (error instanceof ValidationError) {
      next(new HttpCustomError('validation error', 400, error));
    }
    if (error instanceof ConflictResourceError) {
      next(new HttpCustomError('conflict resource', 409, error));
    }
    if (error instanceof NotFoundError || error instanceof UnAuthorizedError) {
      next(new HttpCustomError('unauthorized', 401, error));
    }
    next(new HttpCustomError('unknown error', 500, error));
  }
});
