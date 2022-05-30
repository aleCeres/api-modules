
# API MODULES

The goal of the project is the creation of n modules in order to speed up the creation of a product.

The module created is the `user` one. There are basically 3 routes in order to signup, login and signup with google. In order to complete the user module the authorization should be implemtented.
For the authorization I am going to use [casbin](https://github.com/casbin/node-casbin) defining RBAC authorization system.

## OBJECTIVE

The goal is to reduce the time to create a product project since I worked for 6 years for early stage startup and I want to modularize standard
backend component, this beacuse speed is crucial in fast paced environments.

The roadmap is:

- **user_module**: signup, login, signup with socials (google, linkedin), authorization
- **notification_module**: email and web push notification management
- **team_module**: team management with basic role (owner, admin, member)
- **cache_layer**: implement cache layer with redis

## Installation

Install api-modules dependencies with yarn

```bash
  cd api-modules
  yarn
```

Start services with docker compose:

```bash
yarn compose

```

Then apply metadata and migration using hasura

```bash
yarn hasura metadata apply
yarn hasura migrate apply
yarn hasura migrate reload
```

I use [Hasura](https://hasura.io/) because you can expose GraphQL and REST api directly linking your data source(s) without effort.

Check please the environment variables in the section below.

Finally, you can run the server:

```bash
yarn start

```

## Running Tests

To run tests, run the following command

```bash
  yarn test:compose
  yarn test:hasura metadata apply
  yarn test:hasura migrate apply
  yarn test:hasura migrate reload
```

and after this command run

```bash
  yarn test
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

```
PORT=3333
POSTGRES_PASSWORD=test_password
POSTGRES_USER=test_user
POSTGRES_DB=ceres_db
POSTGRES_PORT=5433
GOOGLE_CLIENT_ID=apps.googleusercontent.com
HASURA_GRAPHQL_METADATA_DATABASE_URL=postgres://test_user:test_password@postgres_test:5433/ceres_db
HASURA_GRAPHQL_DATABASE_URL=postgres://test_user:test_password@postgres_test:5433/ceres_db
HASURA_GRAPHQL_ENABLE_CONSOLE=true
HASURA_GRAPHQL_DEV_MODE=true
HASURA_GRAPHQL_ENABLED_LOG_TYPES=startup, http-log, webhook-log, websocket-log, query-log
HASURA_GRAPHQL_ADMIN_SECRET=test_secret_key
JWT_SECRET=saadsasd
```
