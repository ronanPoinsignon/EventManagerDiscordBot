export const environment = {
  production: true,
  apiUrl: 'http://backend-api:' + process.env.API_PORT,
  frontEndUrl: 'http://localhost:' + process.env.FRONTEND_PORT,
  keycloakURL: 'http://keycloak:' + process.env.KEYCLOAK_PORT,
  rabbitURL: 'rabbit:' + process.env.RABBITMQ_PORT
};