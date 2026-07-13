import axios from "axios";
import { destroyCookie, parseCookies } from "nookies";

export function getAPIClient(ctx?: any) {
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT_API,
  });

  api.interceptors.request.use(
    (config) => {
      const { "portal.token": token } = parseCookies(ctx);
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response?.status === 401 || error.response?.status === 403) {
        destroyCookie(ctx, "portal.token", { path: "/" });
        if (typeof window !== "undefined") {
          window.location.href = "/";
        }
      }
      return Promise.reject(error.response);
    }
  );
  return api;
}

export function getExternalClient(baseURL: string) {
  const externalApi = axios.create({
    baseURL: baseURL,
  });
  externalApi.defaults.headers.put["Content-Type"] = "application/pdf";

  externalApi.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      return Promise.reject(error.response);
    }
  );
  return externalApi;
}
