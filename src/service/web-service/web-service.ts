import { keycloakService } from '../keycloak-service.js';
import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException, UnauthorizedException, WebException
} from './web-exception/web-exception.js';
import { configuration } from '../../configuration.js';

export class WebService {

  private static baseURL = configuration.apiURL.replace(/\/$/, "");

  protected get<T>(url: string, userId: string, params?: Record<string, any>): Promise<T> {
    return this.request(url, userId, "GET", params);
  }

  protected post<T, U>(url: string, userId: string, params?: Record<string, any>, body?: U): Promise<T> {
    return this.request(url, userId, "POST", params, body);
  }

  protected delete<T>(url: string, userId: string, params?: Record<string, any>): Promise<T> {
    return this.request(url, userId, "DELETE", params);
  }

  private async request<T, U>(url: string, userId: string, method: "GET" | "POST" | "PUT" | "DELETE", params?: Record<string, any>, body?: U): Promise<T> {
    let token = await keycloakService.getAccessToken();

    if(!params) {
       params = {};
    }
    const query = Object.entries(params)
      .filter(([key, value]) => value != null)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');

    const response = await fetch(
      WebService.baseURL + url + "?" + query,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-Discord-User-Id": userId
        },
        method,
        body: JSON.stringify(body)
      }
    ).catch(err => {
      if(err instanceof Error && err.message === "fetch failed") {
        throw new InternalServerErrorException("Aucune réponse venant du serveur.");
      }

      console.error(err);
      throw new InternalServerErrorException("Une erreur est survenue.");
    });

    const bodyResponse = await response.json();
    dateHandler(bodyResponse);

    if(!response.ok) {
      throw this.handleError(bodyResponse as ErrorBody);
    }

    return bodyResponse as T;
  }

  private handleError(error: ErrorBody): WebException {
    const status = error.status;
    switch(status) {
      case 400:
        return new BadRequestException(error.properties.error.message);
      case 401:
        return new UnauthorizedException(error.properties.error.message);
      case 404:
        return new NotFoundException(error.properties.error.message);
      case 403:
        return new ForbiddenException(error.properties.error.message);
      case 500:
        return new InternalServerErrorException(error.properties.error.message);
      default:
        return new WebException(status, error.properties.error.message);
    }
  }
}

const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d*)?(?:[-+]\d{2}:?\d{2}|Z)?$/;

function isIsoDate(value: string): boolean {
  return ISO_DATE_REGEX.test(value);
}

function dateHandler(obj: any){
  if (!obj || typeof obj !== 'object') return obj;

  for (const key of Object.keys(obj)) {
    const value = obj[key];

    if(typeof value === 'object') {
      dateHandler(value);
    }
    else if (typeof value === 'string' && isIsoDate(value)) {
      obj[key] = new Date(value);
    }
  }
}

interface ErrorBody {
  instance: string;
  status: number;
  title: string;
  properties: {
    error: {
      message: string;
      parameter : {
        name: string;
        value: string;
        expectedType: string;
      }
    }
  };
}