import Cookies from "js-cookie";

import { ReactNode, createContext, useEffect, useState } from "react";
import { LoginDTO, User } from "@/services/user/type";
import { authenticate, login, statusToken } from "@/services/auth";
import { getUser } from "@/services/user";
import { useRouter } from "next/router";
import { AuthResponse } from "@/services/auth/types";
import { destroyCookie, setCookie } from "nookies";

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

  async function handleLogin(loginDTO: LoginDTO) {
    setLoading(true);
    try {
      const resp = await login(loginDTO);
      if (resp) {
        const cookieParams = {};
        localStorage.setItem("portal.id", resp.id);
        localStorage.setItem("portal.name", resp.name);
        localStorage.setItem("portal.username", resp.username);
        localStorage.setItem("portal.role", resp.highestPriorityRole);
        localStorage.setItem("portal.token", resp.token);
        window.sessionStorage.setItem("token", resp.token);
        setCookie(undefined, "portal.token", resp.token, cookieParams);
        setCookie(
          undefined,
          "portal.role",
          resp.highestPriorityRole,
          cookieParams
        );
        setUser({
          ...user,
          id: resp.id,
          name: resp.name,
          highestPriorityRole: resp.highestPriorityRole,
          username: resp.username,
        });
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
    setTimeout(() => setMsg(""), 3000);
  }

  function logout() {
    destroyCookie(null, "portal.token", {});
    localStorage.clear();
    router.push("/");
  }

  function softLogout() {
    destroyCookie(null, "portal.token", {});
    localStorage.clear();
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
