import { CONFIG } from "@/config";
import { IRefreshTokenRequest, IRefreshTokenResponse } from "@shared/types";
import axios from "axios";
import { saveAuthorizationInfo } from "@shared/utils";
import store from "@shared/store";
import { signOut } from "@shared/store/auth";

export class BaseAuthInterceptor {
  private refreshTokenPromise: Promise<string | null> | null = null;

  protected async getRefreshPromise(authRequestObject: IRefreshTokenRequest) {
    if (this.refreshTokenPromise) return this.refreshTokenPromise;
    this.refreshTokenPromise = this.sendRefreshRequest(authRequestObject);

    return this.refreshTokenPromise;
  }

  protected async sendRefreshRequest(authRequest: IRefreshTokenRequest) {
    try {
      const identityInstance = axios.create({
        baseURL: CONFIG.IDENTITY_API_URL,
      });
      const response = (
        await identityInstance.post<IRefreshTokenResponse>(
          "identity/refresh-token",
          authRequest
        )
      ).data;

      if (!response.refreshToken || !response.accessToken) {
        throw new Error("REFRESH_TOKEN_PROBLEM 2");
      }

      saveAuthorizationInfo({
        refreshToken: response.refreshToken,
        accessToken: response.accessToken,
        accessTokenExpiration: response.accessTokenExpiration.toString(),
        refreshTokenExpiration: response.refreshTokenExpiration.toString(),
      });

      return response.accessToken;
    } catch (e) {
      store.dispatch(signOut());

      return null;
    } finally {
      this.refreshTokenPromise = null;
    }
  }
}
