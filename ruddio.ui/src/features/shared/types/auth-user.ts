import { TLocale } from ".";

export interface ITokenInfo {
  refreshToken: string | null;
  refreshTokenExpiration: string | null;
  accessToken: string | null;
  accessTokenExpiration: string | null;
}

export interface IUserProfile {
  timeZoneId: string;
  locale: TLocale;
  image: string | null;
  id: string | null;
  userName: string | null;
}

export interface IUserState extends ITokenInfo, IUserProfile {
  isLoading: boolean;
  isAuthorized: boolean;
  isLocalizationLoading: boolean;
}
