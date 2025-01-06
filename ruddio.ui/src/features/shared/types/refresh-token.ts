export interface IRefreshTokenRequest {
  accessToken: string;
  refreshToken: string;
}

export interface IRefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiration: Date;
  refreshTokenExpiration: Date;
}
