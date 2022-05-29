import { sign, verify } from 'jsonwebtoken';
import log from '../logger';
import AuthToken from '../../types/AuthToken';

const JWT_SECRET_BUFFER = Buffer.from(process.env.JWT_SECRET ?? 'secret', 'base64');

export const getAuthToken = (userId: number) => {
  const authToken = new AuthToken({ sub: userId.toString() });
  return sign(JSON.parse(JSON.stringify(authToken)), JWT_SECRET_BUFFER);
};

export const verifyAuthToken = (jwt: string | undefined | null, ignoreExp?: boolean) => {
  if (!jwt) {
    return {};
  }
  try {
    return verify(jwt, JWT_SECRET_BUFFER, {
      ignoreExpiration: ignoreExp,
      clockTolerance: 10,
    }) as AuthToken;
  } catch (e) {
    const errMsg = 'Verify auth token failed';
    log.error({ e }, errMsg);
    throw new Error(errMsg);
  }
};

