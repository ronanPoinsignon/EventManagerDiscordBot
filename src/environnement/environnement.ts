import { envVariableUtils } from '../utils/env-variable-utils.js';

export const environment = Object.freeze({
  production: false,
  apiUrl: 'http://localhost:' + envVariableUtils.requireEnv('API_PORT'),
  frontEndUrl: 'http://localhost:' + envVariableUtils.requireEnv('FRONTEND_PORT'),
  keycloakURL: 'http://localhost:' + envVariableUtils.requireEnv('KEYCLOAK_PORT'),
  rabbitURL: 'localhost:' + envVariableUtils.requireEnv('RABBITMQ_PORT'),
});