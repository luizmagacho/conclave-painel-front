import Cookies from "js-cookie";

import { ReactNode, createContext, useEffect, useState } from "react";
import { LoginDTO, User } from "@/services/user/type";
import { authenticate, login, statusToken } from "@/services/auth";
import { getUser } from "@/services/user";
import { useRouter } from "next/router";
import { AuthResponse } from "@/services/auth/types";

interface ProviderProps {
  children: ReactNode;
}

interface AuthContextProps {
  handleLogin: (loginDTO: LoginDTO) => Promise<void>;
  logout: () => void;
  softLogout: () => void;
  msg: string;
  loading: boolean;
  user: User;
}

export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({ children }: ProviderProps) => {
  const [user, setUser] = useState<User>({} as User);
  const [authResponse, setAuthResponse] = useState<AuthResponse>(
    {} as AuthResponse
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [msg, setMsg] = useState("");
  const router = useRouter();

  useEffect(() => {
    const usr = Cookies.get("portal.name");
    if (usr) {
      setUser({
        ...user,
        name: usr,
      });
    }
  }, []);

  /**
   * Por enquanto o token está chegando nulo
   * Quando normalizar, descomentar as linhas abaixo!
   */
  async function handleLogin(loginDTO: LoginDTO) {
    setLoading(true);
    try {
      const resp = await login(loginDTO);
      console.log(resp);
      if (resp) {
        Cookies.set("portal.id", resp.id);
        Cookies.set("portal.name", resp.name);
        Cookies.set("portal.username", resp.username);
        Cookies.set("portal.role", resp.role);
        Cookies.set("portal.token", resp.token);
        router.push("/home");
      }
      if (!resp) {
        setTempMessage("Login ou senha incorretos");
      }
    } catch (_) {
      setTempMessage("Login ou senha incorretos");
    } finally {
      setLoading(false);
    }
  }

  function setTempMessage(message: string) {
    setMsg(message);
    console.log("Message: ", message);
    setTimeout(() => setMsg(""), 3000);
  }

  function logout() {
    Cookies.remove("portal.token");
    Cookies.remove("portal.username");
    window.localStorage.clear();
    window.sessionStorage.clear();
    router.push("/");
  }

  function softLogout() {
    Cookies.remove("portal.token");
    Cookies.remove("portal.username");
    window.localStorage.clear();
    window.sessionStorage.clear();
  }

  return (
    <AuthContext.Provider
      value={{
        handleLogin,
        logout,
        softLogout,
        msg,
        loading,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
