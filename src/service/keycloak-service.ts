import { configuration } from '../configuration.js';

type TokenResponse = {
  access_token: string;
  expires_in: number;
};

export class KeycloakService {

  private accessToken: string | null = null;
  private expiresAt: number | null = null;

  async getAccessToken(): Promise<string> {
    if (this.accessToken && this.expiresAt && Date.now() < this.expiresAt) {
      return this.accessToken;
    }

    return this.refreshToken();
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
    );

    if (!response.ok) {
      throw new Error(`Keycloak auth failed: ${response.status}`);
    }

    const json = await response.json() as TokenResponse;

    this.accessToken = json.access_token;
    this.expiresAt = Date.now() + ((json.expires_in - 30) * 1000);

    return this.accessToken;
  }

  async impersonate(userId: string) {
    const params = new URLSearchParams();
    params.append("grant_type", "urn:ietf:params:oauth:grant-type:token-exchange");
    params.append("client_id", configuration.keycloakClientId);
    params.append("client_secret", configuration.keycloakClientSecret);
    params.append("subject_token", await this.getAccessToken());
    params.append("requested_subject", userId);
    params.append("requested_token_type", "urn:ietf:params:oauth:token-type:access_token");

    return await fetch(
      `${configuration.keycloakURL}realms/${configuration.keycloakRealm}/protocol/openid-connect/token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: params
      }
    );
  }
}

export const keycloakService = new KeycloakService();