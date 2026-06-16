import { configuration } from '../configuration.js';
import { InternalServerErrorException } from './web-service/web-exception.js';
import { loggerService } from './log-service.js';

type TokenResponse = {
  access_token: string;
  expires_in: number;
};

export class KeycloakService {

  private accessToken: string | null = null;
  private expiresAt: number | null = null;

  private refreshPromise?: Promise<string>;
  private readonly SAFETY_MARGIN = 30000;

  async getAccessToken(): Promise<string> {
    // refresh le token s'il ne reste que 30 secondes
    if (this.accessToken && this.expiresAt && Date.now() < (this.expiresAt - this.SAFETY_MARGIN)) {
      return this.accessToken;
    }

    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.refreshToken();

    try {
      return await this.refreshPromise;
    } finally {
      this.refreshPromise = undefined;
    }
  }

  private async refreshToken(): Promise<string> {
    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    params.append("client_id", configuration.keycloakClientId);
    params.append("client_secret", configuration.keycloakClientSecret);

    const response = await fetch(
      `${configuration.keycloakURL}/realms/${configuration.keycloakRealm}/protocol/openid-connect/token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: params
      }
    ).catch(err => {
      loggerService.error(err);
      if(err instanceof Error && err.message === "fetch failed") {
        throw new InternalServerErrorException("Aucune réponse venant du gestionnaire d'utilisateurs.");
      }

      throw new InternalServerErrorException("Une erreur est survenue.");
    });

    if (!response.ok) {
      throw new Error(`Keycloak auth failed: ${response.status}`);
    }

    const json = await response.json() as TokenResponse;

    this.accessToken = json.access_token;
    this.expiresAt = Date.now() + ((json.expires_in - 30) * 1000);

    return this.accessToken;
  }

}

export const keycloakService = new KeycloakService();