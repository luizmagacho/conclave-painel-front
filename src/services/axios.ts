import axios from "axios";
import { destroyCookie, parseCookies } from "nookies";

export function getAPIClient(ctx?: any) {
  const { "portal.token": token } = parseCookies(ctx);
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT_API,
  });

  if (token) {
    api.defaults.headers["Authorization"] = `Bearer ${token}`;
  }
  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response.status === 401) {
        destroyCookie(null, "portal.token");
        window.location.href = "/";
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
