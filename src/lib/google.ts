import correlator from 'express-correlation-id';

import { OAuth2Client } from 'google-auth-library';
import log from '../logger';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const getUserByToken = async (token: string, googleClient: OAuth2Client = client) => {
  const ticket = await googleClient.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();

  if (!payload || !payload.email) {
    throw new Error('email not present in payload');
  }

  const formattedPayload = {
    email: payload.email,
    first_name: payload.given_name ?? '',
    last_name: payload.family_name ?? '',
    signup_kind: 'google',
  };
  log.info({
    correlationId: correlator.getId(),
    email: formattedPayload.email,
  }, 'Called gooogle api for user');

  return formattedPayload;
};
