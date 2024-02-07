import { login } from "@/services/auth";
import { getUsers } from "@/services/user";
import { LoginDTO, User } from "@/services/user/type";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { ReactNode, createContext, useEffect, useState } from "react";

interface ProviderProps {
  children: ReactNode;
}

interface UserContextProps {
  users: User[];
  loading: boolean;
  totalElements: number;
  handleGetUsers: (page?: number, name?: string) => Promise<void>;
}

export const UserContext = createContext({} as UserContextProps);

export const UserProvider = ({ children }: ProviderProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [bufferedUsers, setBufferedUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [totalElements, setTotalElements] = useState<number>(0);

  const router = useRouter();

  async function handleGetUsers(page: number = 0, name: string = "") {
    setLoading(true);

    try {
      const { content, totalElements } = await getUsers({
        page,
        size: 10,
        name,
      });
      setBufferedUsers(content || []);
      setUsers(content || []);
      setTotalElements(totalElements);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    Cookies.remove("portal.token");
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

  useEffect(() => {
    handleGetUsers();
  }, []);

  return (
    <UserContext.Provider
      value={{
        users,
        loading,
        totalElements,
        handleGetUsers,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
