import { CONFIG } from "@/config";
import { makeService } from "../utils";
import { AxiosInstance, AxiosResponse, CreateAxiosDefaults } from "axios";
import { IInterceptor } from "./interceptors/interceptor";

class BaseServiceContext {
  protected getServiceBase(
    endpoint: string,
    baseUrl: string,
    config?: CreateAxiosDefaults
  ): ApiService {
    return this.makeService(endpoint, {
      baseURL: baseUrl,
      ...config,
    });
  }

  protected makeService(
    endpoint: string,
    config?: CreateAxiosDefaults
  ): ApiService {
    return new ApiService(endpoint, config);
  }
}

class IdentityServiceContext extends BaseServiceContext {
  public specialistApplications(config?: CreateAxiosDefaults): ApiService {
    return this.makeService("specialistApplications", {
      baseURL: CONFIG.IDENTITY_API_URL,
      ...config,
    });
  }

  public getService(
    endpoint: string,
    config?: CreateAxiosDefaults
  ): ApiService {
    return super.getServiceBase(endpoint, CONFIG.IDENTITY_API_URL, config);
  }
}

export default class ApiContext {
  public identity(): IdentityServiceContext {
    return new IdentityServiceContext();
  }
}

export class ApiService {
  protected service: AxiosInstance;
  protected endpoint: string;
  protected params: TRequestParams = {};

  constructor(endpoint: string, config?: CreateAxiosDefaults) {
    this.endpoint = endpoint;
    this.service = makeService(config);
  }

  public use(interceptor: IInterceptor): ApiService {
    this.service = interceptor.addInterceptor(this.service);
    return this;
  }

  public useMany(interceptors: IInterceptor[]): ApiService {
    interceptors.forEach((i) => {
      this.use(i);
    });

    return this;
  }

  public top(top: number): ApiService {
    this.params.top = top;
    return this;
  }

  public skip(skip: number): ApiService {
    this.params.skip = skip;
    return this;
  }

  public filter(filter: string): ApiService {
    this.params.filter = filter;
    return this;
  }

  public select(select: string[]): ApiService {
    this.params.select = select;
    return this;
  }

  public expand(expand: TExpand[]): ApiService {
    this.params.expand = expand;
    return this;
  }

  public orderBy(property: string, descending: boolean = false): ApiService {
    this.params.orderby = `${property} ${descending ? "desc" : "asc"}`;
    return this;
  }

  public single(key: string): ApiService {
    this.endpoint += `(${key})`;
    return this;
  }

  public async get(): Promise<AxiosResponse<any, any>> {
    return await this.service.get(this.getUrl());
  }

  public async post<TBody>(body?: TBody): Promise<AxiosResponse<any, any>> {
    return await this.service.post(this.getUrl(), body);
  }

  public async postForm<TBody>(body?: TBody): Promise<AxiosResponse<any, any>> {
    return await this.service.postForm(this.getUrl(), body);
  }

  private getUrl(): string {
    let url = this.buildQueryURL(this.params);
    url = this.trimLastAmpersant(url);

    return !!url ? this.endpoint + "?" + url : this.endpoint;
  }

  private trimLastAmpersant(url: string): string {
    if (url[url.length - 1] === "&") {
      url = url.replace(/.$/, "");
    }

    return url;
  }

  private buildQueryURL(query: TRequestParams): string {
    let url: string = "";
    if (query.skip) {
      url += `$skip=${query.skip}&`;
    }

    if (query.top) {
      url += `$top=${query.top}&`;
    }

    if (query.select) {
      url += `$select=${query.select.join(",")}&`;
    }

    if (query.orderby) {
      url += `$orderby=${query.orderby}&`;
    }

    if (query.expand && query.expand.length) {
      query.expand.forEach((e) => {
        url += `$expand=${e.property}`;

        if (e.params) {
          let subUrl = this.buildQueryURL(e.params);
          subUrl = this.trimLastAmpersant(subUrl);
          url += `(${subUrl})`;
        }

        url += "&";
      });
    }

    if (query.filter) {
      url += `$filter=${query.filter}&`;
    }

    return url;
  }
}

export type TExpand = {
  property: string;
  params?: TRequestParams;
};

export type TRequestParams = {
  expand?: TExpand[];
  filter?: string;
  select?: string[];
  top?: number;
  skip?: number;
  orderby?: string;
};
