import { AxiosInstance } from "axios";

export interface IInterceptor {
  addInterceptor(instance: AxiosInstance): AxiosInstance;
}
