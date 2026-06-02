import { render, type RenderOptions } from "@testing-library/react";
import { PrimeReactProvider } from "primereact/api";
import React, { type ReactElement } from "react";
import { AuthContext, type AuthContextProps } from "@/context/AuthContext";
import type { User } from "@/services/user/type";

const stubUser = {
  id: "1",
  name: "Tester",
  username: "tester",
  department: "",
  password: "",
  role: "",
  profiles: [],
  profilesName: "",
  highestPriorityRole: "Administrador",
  createdAt: "",
  createdAtFormat: "",
  updatedAt: "",
} as User;

const defaultAuth: AuthContextProps = {
  handleLogin: async () => {},
  logout: () => {},
  softLogout: () => {},
  msg: "",
  loading: false,
  user: stubUser,
  authReady: true,
};

export function renderWithProviders(
  ui: ReactElement,
  options?: RenderOptions & { auth?: Partial<AuthContextProps> }
) {
  const { auth, ...renderOptions } = options ?? {};
  const value: AuthContextProps = { ...defaultAuth, ...auth };

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <PrimeReactProvider>
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
      </PrimeReactProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}
