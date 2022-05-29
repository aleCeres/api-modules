import { toEpochSeconds } from '../src/utils/epochTime';

const JWT_LIFESPAN = 2592000000; // 30 days

interface Input {
  sub: string;
}

export default class AuthToken {
  sub: string
  iat: number
  iss: string
  exp: number
  aud: string
  constructor(input: Input) {
    const {
      sub,
    } = input;
    const now = new Date();
    this.sub = sub;
    this.iat = toEpochSeconds(now);
    this.aud = 'action';
    this.iss = 'http:localhost'; // TODO: change it
    this.exp = toEpochSeconds(now.getTime() + JWT_LIFESPAN);
  }
}
