import { getEnvironnement } from './environnement-manager.js'

export const configuration = {
    apiURL: getEnvironnement().apiUrl,
    frontEndUrl: getEnvironnement().frontEndUrl,
    keycloakURL: getEnvironnement().keycloakURL,
    keycloakRealm: process.env["KEYCLOAK_REALM"]!,
    keycloakClientId: process.env["KEYCLOAK_CLIENT_NAME"]!,
    keycloakClientSecret: process.env["KEYCLOAK_CLIENT_SECRET"]!,
    token: process.env['TOKEN']!,
    discordClientId: "1508982800437608590"
}