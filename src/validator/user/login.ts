import Joi from 'joi';
import { Request } from 'express';

import { ValidationError } from '../../errors/ValidationError';
import log from '../../logger';

type Body = {
  email: string;
  password: string;
};

const schema = Joi.object<Body>({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

export const validateLogin = async (
  request: Request,
): Promise<{ email: string; password: string}> => {
  if (!request.body) {
    throw new Error('Missing request body');
  }

  try {
    const {
      email, password,
    } = (await schema.validateAsync(request.body));
    return {
      email, password,
    };
  } catch (error) {
    log.error({ error });
    throw new ValidationError('validation error');
  }
};
