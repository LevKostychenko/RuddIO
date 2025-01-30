import { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { IInterceptor } from "./interceptor";
import { getAuthorizationInfo } from "@shared/utils";
import moment from "moment";
import { IRefreshTokenRequest, ITokenInfo } from "@shared/types";
import store from "@shared/store";
import { signOut } from "@shared/store/auth";
import { BaseAuthInterceptor } from "./base-auth-interceptor";

export class RefreshTokenInterceptor
  extends BaseAuthInterceptor
  implements IInterceptor
{
  public addInterceptor(instance: AxiosInstance): AxiosInstance {
    instance.interceptors.request.use(this.checkRefreshingToken.bind(this));
    return instance;
  }

  private accessTokenNeedRefresh(userInfo: ITokenInfo) {
    return moment(userInfo.accessTokenExpiration) <= moment().utc();
  }
  private refreshTokenNeedRefresh(userInfo: ITokenInfo) {
    return moment(userInfo.refreshTokenExpiration) <= moment().utc();
  }

  private async checkRefreshingToken(
    axiosConfig: InternalAxiosRequestConfig
  ): Promise<InternalAxiosRequestConfig> {
    const userInfo = getAuthorizationInfo();
    let accessToken: string | null;
    if (!userInfo || this.refreshTokenNeedRefresh(userInfo)) {
      store.dispatch(signOut());
      return axiosConfig;
    }

    if (this.accessTokenNeedRefresh(userInfo)) {
      const authRequestObject: IRefreshTokenRequest = {
        accessToken: userInfo.accessToken!,
        refreshToken: userInfo.refreshToken!,
      };

      accessToken = await super.getRefreshPromise(authRequestObject);
      if (!accessToken) return axiosConfig;
    } else {
      accessToken = userInfo.accessToken;
    }

    (axiosConfig?.headers as any)["Authorization"] = `Bearer ${accessToken}`;
    return axiosConfig;
  }
}
