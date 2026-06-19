import { getEnvironnement } from './environnement-manager.js'
import { envVariableUtils } from './utils/env-variable-utils.js';

const rabbitUsername = envVariableUtils.requireEnv("RABBITMQ_USERNAME");
const rabbitPassword = envVariableUtils.requireEnv("RABBITMQ_PASSWORD");

export const configuration = Object.freeze({
    apiURL: getEnvironnement().apiUrl,
    frontEndUrl: getEnvironnement().frontEndUrl,
    keycloakURL: getEnvironnement().keycloakURL,
    keycloakRealm: envVariableUtils.requireEnv("KEYCLOAK_REALM"),
    keycloakClientId: envVariableUtils.requireEnv("KEYCLOAK_CLIENT_NAME"),
    keycloakClientSecret: envVariableUtils.requireEnv("KEYCLOAK_CLIENT_SECRET"),
    rabbitURL: `amqp://${rabbitUsername}:${rabbitPassword}@` + getEnvironnement().rabbitURL,
    token: envVariableUtils.requireEnv('TOKEN'),
    discordClientId: envVariableUtils.requireEnv("DISCORD_CLIENT_ID")
});