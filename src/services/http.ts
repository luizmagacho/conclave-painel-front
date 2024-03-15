import axios, { AxiosInstance, AxiosResponse } from "axios";
import Cookies from "js-cookie";
import AuthManager from "./auth/functions";
import { error } from "console";
import { parseCookies } from "nookies";

interface HttpProps {
  axiosConfig: AxiosInstance;
  get: <T>(route: string, body?: any) => Promise<AxiosResponse<T, any>>;
  put: <T>(route: string, body?: any) => Promise<AxiosResponse<T, any>>;
  patch: <T>(route: string, body?: any) => Promise<AxiosResponse<T, any>>;
  post: <T>(
    route: string,
    body?: any,
    formData?: FormData | undefined
  ) => Promise<AxiosResponse<T, any>>;
  delete: <T>(route: string, body?: any) => Promise<AxiosResponse<T, any>>;
}

let token = null;
if (typeof window !== "undefined") {
  token = localStorage.getItem("portal.token");
}

const backendBaseUrl = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT_API;

const http: HttpProps = {
  axiosConfig: axios.create({
    baseURL: backendBaseUrl,
  }),

  get: function <T>(route: string, body?: any) {
    return this.axiosConfig.get<T>(route, body).catch((error) => {
      let response = error.response;
      if (
        response?.status === 401 &&
        response?.data?.message === "Acesso Negado"
      ) {
        AuthManager.logout();
      }
      return error;
    });
  },

  patch: function <T>(route: string, body?: any) {
    return this.axiosConfig.patch<T>(route, body).catch((error) => {
      let response = error.response;
      if (
        response?.data?.statusCode === 401 &&
        response?.data?.message === "Acesso Negado"
      ) {
        AuthManager.logout();
      }
      return error;
    });
  },

  put: function <T>(route: string, body?: any) {
    return this.axiosConfig.put<T>(route, body).catch((error) => {
      let response = error.response;
      if (
        response?.data?.statusCode === 401 &&
        response?.data?.message === "Acesso Negado"
      ) {
        AuthManager.logout();
      }
      return error;
    });
  },

  delete: function <T>(route: string, body?: any) {
    return this.axiosConfig.delete<T>(route, body).catch((error) => {
      let response = error.response;
      if (
        response?.data?.statusCode === 401 &&
        response?.data?.message === "Acesso Negado"
      ) {
        AuthManager.logout();
      }
      return error;
    });
  },

  post: function <T>(route: string, body?: any, formData?: FormData) {
    // Se formData estiver presente, use-o para enviar dados
    if (formData) {
      return this.axiosConfig
        .post<T>(route, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .catch((error) => {
          // Trate os erros aqui, se necessário
          return error;
        });
    }

    // Caso contrário, use o corpo JSON padrão
    return this.axiosConfig.post<T>(route, body).catch((error) => {
      // Trate os erros aqui, se necessário
      let response = error.response;
      if (
        response?.data?.statusCode === 401 &&
        response?.data?.message === "Acesso Negado"
      ) {
        AuthManager.logout();
      }
      return error;
    });
  },
};

export default http;
