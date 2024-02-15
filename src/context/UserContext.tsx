import { login } from "@/services/auth";
import {
  changePasswordUser,
  deleteUser,
  getUser,
  getUserById,
  getUsers,
  postUser,
  updateUser,
} from "@/services/user";
import {
  LoginDTO,
  User,
  UserChangePasswordRequest,
  UserRequestDTO,
} from "@/services/user/type";
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
  handlePostUser: (user: UserRequestDTO) => Promise<void>;
  handleUpdateUser: (user: User) => Promise<void>;
  handleDeleteUser: (userId: string) => Promise<void>;
  handleGetUser: (userId: string) => Promise<void>;
  handleChangePassword: (
    userChangePasswordRequest: UserChangePasswordRequest
  ) => Promise<void>;
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

  async function handleGetUser(userId: string) {
    setLoading(true);

    try {
      const resp = await getUserById(userId);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handlePostUser(user: UserRequestDTO) {
    setLoading(true);

    try {
      const resp = await postUser(user);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateUser(user: User) {
    setLoading(true);

    try {
      const resp = await updateUser(user);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteUser(userId: string) {
    setLoading(true);

    try {
      const resp = await deleteUser(userId);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleChangePassword(
    userChangePassword: UserChangePasswordRequest
  ) {
    setLoading(true);

    try {
      const resp = await changePasswordUser(userChangePassword);
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
        handlePostUser,
        handleUpdateUser,
        handleDeleteUser,
        handleGetUser,
        handleChangePassword,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
