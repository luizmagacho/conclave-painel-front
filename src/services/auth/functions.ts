import Cookies from "js-cookie";
import { AuthManager } from "./types";

const gerenciadorAutenticacao: AuthManager = {
  logout: () => {
    Cookies.remove("portal.token");
    Cookies.remove("portal.role");
    Cookies.remove("portal.name");
    window.localStorage.clear();
    window.sessionStorage.clear();
    window.location.href = "/";
  },
};

export default gerenciadorAutenticacao;
