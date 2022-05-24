import Joi from 'joi';
import { Request } from 'express';

import { ValidationError } from '../../errors/ValidationError';
import log from '../../logger';

type Body = {
  token: string;
};

const schema = Joi.object<Body>({
  token: Joi.string().required(),
});

export const validateGoogleAuth = async (
  request: Request,
): Promise<{ token: string }> => {
  if (!request.body) {
    throw new Error('Missing request body');
  }

  try {
    const { token } = (await schema.validateAsync(request.body));
    return { token };
  } catch (error) {
    log.error({ error });
    throw new ValidationError('validation error');
  }
};
