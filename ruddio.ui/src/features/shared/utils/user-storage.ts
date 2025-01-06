import { ITokenInfo } from "@shared/types";
import {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
  ACCESS_TOKEN_EXPIRES_AT,
  REFRESH_TOKEN_EXPIRES_AT,
} from "../constants";

export const saveAuthorizationInfo = (accessInfo: ITokenInfo): void => {
  accessInfo.accessToken &&
    localStorage.setItem(ACCESS_TOKEN, accessInfo.accessToken);
  accessInfo.refreshToken &&
    localStorage.setItem(REFRESH_TOKEN, accessInfo.refreshToken);
  accessInfo.accessTokenExpiration &&
    localStorage.setItem(
      ACCESS_TOKEN_EXPIRES_AT,
      accessInfo.accessTokenExpiration
    );
  accessInfo.refreshTokenExpiration &&
    localStorage.setItem(
      REFRESH_TOKEN_EXPIRES_AT,
      accessInfo.refreshTokenExpiration
    );
};

export const getAuthorizationInfo = (): ITokenInfo | null => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN);
  const refreshToken = localStorage.getItem(REFRESH_TOKEN);
  const accessTokenExpiration = localStorage.getItem(ACCESS_TOKEN_EXPIRES_AT);
  const refreshTokenExpiration = localStorage.getItem(REFRESH_TOKEN_EXPIRES_AT);

  if (
    !accessToken ||
    !refreshToken ||
    !accessTokenExpiration ||
    !refreshTokenExpiration
  ) {
    return null;
  }

  return {
    accessToken,
    refreshToken,
    accessTokenExpiration,
    refreshTokenExpiration,
  };
};

export const clearAuthorizationInfo = (): void => {
  localStorage.removeItem(ACCESS_TOKEN);
  localStorage.removeItem(REFRESH_TOKEN);
  localStorage.removeItem(ACCESS_TOKEN_EXPIRES_AT);
  localStorage.removeItem(REFRESH_TOKEN_EXPIRES_AT);
};
