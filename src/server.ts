import 'dotenv/config';
import 'reflect-metadata';
import correlator from 'express-correlation-id';
import express from 'express';
import helmet from 'helmet';

import { AppDataSource } from './AppDataSource';
import errorHandler from './middleware/errorHandler';
import { googleAuthRouter } from './routes/user/auth/googleAuth';
import log from './logger';

const app = express();

// HELMET
app.use(helmet.hsts()); // Strict-Transport-Security: max-age=15552000; includeSubDomains
app.use(helmet.frameguard({ action: 'deny' })); // X-Frame-Options : DENY
app.use(helmet.hidePoweredBy());
app.use(helmet.noSniff()); // X-Content-Type-Options: nosniff

app.use(helmet.contentSecurityPolicy());
app.use(helmet.expectCt());
app.use(helmet.referrerPolicy({ policy: 'strict-origin-when-cross-origin' }));
app.use((req, res, next) => {
  res.setHeader(
    'Permissions-Policy',
    'geolocation=(), interest-cohort=()',
  );
  next();
});

app.use(express.json());

// CORRELATOR
app.use(correlator());

// ROUTES
app.use('/auth', googleAuthRouter);

app.use(errorHandler);

const server = app.listen(process.env.PORT, async () => {
  log.info({ version: process.env.npm_package_version }, 'Server started');
  await AppDataSource.initialize();
});

export default server;
