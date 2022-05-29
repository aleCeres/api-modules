import correlator from 'express-correlation-id';
import log from '../logger';

import { AppDataSource } from '../AppDataSource';
import { User } from '../entity/User';

const userRepository = AppDataSource.getRepository(User);

export const upsert = async ({
  email, first_name, last_name, signup_kind,
}: {
  email: string; first_name: string; last_name: string; signup_kind: string;
}) => {
  const user = new User();
  user.email = email;
  user.first_name = first_name;
  user.last_name = last_name;
  user.signup_kind = signup_kind;
  user.last_login = new Date();

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
