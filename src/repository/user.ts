import correlator from 'express-correlation-id';
import * as argon2 from 'argon2';
import log from '../logger';

import { AppDataSource } from '../AppDataSource';
import { User } from '../entity/User';

const userRepository = AppDataSource.getRepository(User);

export const upsert = async ({
  email, first_name, last_name, signup_kind, password,
}: {
  email: string;
  first_name: string;
  last_name: string;
  signup_kind: string;
  password?: string;
}) => {
  const user = new User();
  user.email = email;
  user.first_name = first_name;
  user.last_name = last_name;
  user.signup_kind = signup_kind;
  user.last_login = new Date();
  if (password) {
    user.password = await argon2.hash(password);
  }
  await userRepository.upsert(
    user,
    { conflictPaths: ['email'], skipUpdateIfNoValuesChanged: true },
  );

  log.info({
    correlationId: correlator.getId(),
    userId: user.id,
    signupKind: user.signup_kind,
  }, `Upsert user with id: ${user.id}`);

  return user.id;
};

export const getById = async (id: number) => {
  const user = await userRepository.findOne({ where: { id } });
  return user;
};

export const getByEmail = async (email: string) => {
  const user = await userRepository.findOne({ where: { email } });
  return user;
};
