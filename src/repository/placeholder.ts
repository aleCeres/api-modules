import correlator from 'express-correlation-id';
import log from '../logger';

export const placeholder = () => {
  log.info({ correlationId: correlator.getId() }, 'placeholder');
};
