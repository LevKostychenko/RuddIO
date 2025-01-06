import { AxiosInstance } from "axios";
import { IInterceptor } from "./interceptor";

export class ErrorResponseInterceptor implements IInterceptor {
  private onError: ((error: any) => void) | undefined = undefined;

  constructor(onError?: (error: any) => void) {
    this.onError = onError;
  }

  public addInterceptor(instance: AxiosInstance): AxiosInstance {
    instance.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => await this.checkResponseError(error)
    );
    return instance;
  }

  private async checkResponseError(error: any) {
    const showError = (_errorMessage: string) => {};

    if (this.onError) {
      this.onError(error);
    } else {
      if (
        error.response &&
        error.response.status >= 500 &&
        error.message &&
        typeof error.message === "string"
      ) {
        showError(error.message);
      } else if (error.response?.status >= 500) {
        showError("Something went wrong");
      }
    }

    return Promise.reject(error);
  }
}
