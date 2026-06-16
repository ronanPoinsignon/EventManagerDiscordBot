import { envVariableUtils } from '../utils/env-variable-utils.js';

export const environment = {
  production: true,
  apiUrl: 'http://backend-api:' + envVariableUtils.requireEnv('API_PORT'),
  frontEndUrl: 'http://localhost:' + envVariableUtils.requireEnv('FRONTEND_PORT'),
  keycloakURL: 'http://keycloak:' + envVariableUtils.requireEnv('KEYCLOAK_PORT'),
  rabbitURL: 'rabbit:' + envVariableUtils.requireEnv('RABBITMQ_PORT')
};