import Joi from 'joi';
import { Request } from 'express';

import { ValidationError } from '../../errors/ValidationError';
import log from '../../logger';

type Body = {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
};

const schema = Joi.object<Body>({
  email: Joi.string().required(),
  password: Joi.string().required(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
});

export const validateSignup = async (
  request: Request,
): Promise<{ email: string; password: string; first_name: string; last_name: string}> => {
  if (!request.body) {
    throw new Error('Missing request body');
  }

  try {
    const {
      email, password, first_name, last_name,
    } = (await schema.validateAsync(request.body));
    return {
      email, password, first_name, last_name,
    };
  } catch (error) {
    log.error({ error });
    throw new ValidationError('validation error');
  }
};
