export const environment = {
  production: false,
  apiUrl: 'http://localhost:' + process.env.API_PORT,
  frontEndUrl: 'http://localhost:' + process.env.FRONTEND_PORT,
  keycloakURL: 'http://localhost:' + process.env.KEYCLOAK_PORT,
  rabbitURL: 'localhost:' + process.env.RABBITMQ_PORT,
};