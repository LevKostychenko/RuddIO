import { TLocale, TRole } from ".";

export interface ITokenInfo {
  refreshToken: string | null;
  refreshTokenExpiration: string | null;
  accessToken: string | null;
  accessTokenExpiration: string | null;
}

export interface IUserCompany {
  name: string;
  roles: TRole[];
}

export interface IUserProfile {
  timeZoneId: string;
  locale: TLocale;
  image: string | null;
  id: string | null;
  userName: string | null;
  email: string | null;
  roles: TRole[];
  companies: IUserCompany[];
  phone: string | null;

  specialist: ISpecialist | null;
  admin: IAdmin | null;
  customer: ICustomer | null;
}

export interface IUserState extends ITokenInfo, IUserProfile {
  isLoading: boolean;
  isAuthorized: boolean;
  isLocalizationLoading: boolean;
}

export interface ISpecialist {
  description?: string;
  name: string | null;
  surname: string | null;
}

export interface IAdmin {}
export interface ICustomer {}
