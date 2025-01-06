import {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { IInterceptor } from "./interceptor";
import { getAuthorizationInfo } from "@shared/utils";
import { IRefreshTokenRequest } from "@shared/types";
import { BaseAuthInterceptor } from "./base-auth-interceptor";

export class UnauthorizeResponseInterceptor
  extends BaseAuthInterceptor
  implements IInterceptor
{
  private isRefreshing = false;

  public addInterceptor(instance: AxiosInstance): AxiosInstance {
    instance.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) =>
        await this.checkUnauthorizedResponseError(error, instance)
    );
    return instance;
  }

  private async checkUnauthorizedResponseError(
    error: any,
    instance: AxiosInstance
  ): Promise<AxiosResponse<any, any>> {
    const originalRequest: InternalAxiosRequestConfig = error.config;
    const alreadyRefreshed = (originalRequest as any)._alreadyRefreshed;

    if (error.response && error.response.status === 401 && !alreadyRefreshed) {
      if (!this.isRefreshing) {
        this.isRefreshing = true;
        (originalRequest as any)._alreadyRefreshed = true;

        try {
          const userInfo = getAuthorizationInfo();
          if (!userInfo?.accessToken || !userInfo.refreshToken) {
            throw Error();
          }
          const authRequestObject: IRefreshTokenRequest = {
            accessToken: userInfo.accessToken!,
            refreshToken: userInfo.refreshToken!,
          };

          const accessToken = await super.getRefreshPromise(authRequestObject);
          (originalRequest?.headers as any)[
            "Authorization"
          ] = `Bearer ${accessToken}`;

          return instance(originalRequest);
        } catch (refreshError) {
          throw refreshError;
        } finally {
          this.isRefreshing = false;
        }
      }
    }

    return Promise.reject(error);
  }
}
