import { ErrorResponseInterceptor } from "../../services/interceptors/error-response-inerceptor";
import { RefreshTokenInterceptor } from "../../services/interceptors/refresh-token-interceptor";
import { UnauthorizeResponseInterceptor } from "../../services/interceptors/unauthorize-response-interceptor";

export const getDefaultInterceptors = (onError?: (err: any) => void) => [
  new RefreshTokenInterceptor(),
  new UnauthorizeResponseInterceptor(),
  new ErrorResponseInterceptor(onError),
];
