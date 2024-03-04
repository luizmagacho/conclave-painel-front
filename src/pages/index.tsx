import { ReactNode, useContext, useEffect, useState } from "react";

import styled from "styled-components";
import LabelTitle from "@/components/LabelTitle";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { LoginDTO } from "@/services/user/type";
import { AuthContext } from "@/context/AuthContext";
import { Message } from "primereact/message";
import { Logo } from "@/views/common";

interface LeftPanelProps {
  children: ReactNode;
}

const StyledSidebar = styled.aside<LeftPanelProps>`
  flex: 0 0 250px;
  color: var(--cor-fundo);
  font-weight: 400;
  gap: 15px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  overflow: hidden; // Impede que o conteúdo visível quando retraído vaze
  transition: flex 0.5s; // Adiciona uma transição suave
  box-shadow: 5px 0 15px rgba(0, 0, 0, 0.2);
`;

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 90%;
  justify-content: space-evenly;
`;

export default function Login(): JSX.Element {
  const [login, setLogin] = useState<LoginDTO>({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [invalidUsername, setInvalidUsername] = useState<boolean>(false);
  const [invalidPassword, setInvalidPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState(false);
  const [msgError, setMsgError] = useState("");
  const { handleLogin, loading, msg, softLogout } = useContext(AuthContext);

  const ERROR_TIME_AWAIT = 3000;

  useEffect(() => {
    softLogout();
  }, []);

  useEffect(() => {
    if (msg.length > 0) handleError(msg);
  }, [msg]);

  function validateFields() {
    setInvalidUsername(!login.username || login.username === "");
    setInvalidPassword(!login.password || login.password === "");

    if (
      login.username &&
      login.username !== "" &&
      login.password &&
      login.password !== ""
    ) {
      handleLogin(login);
    }
  }

  const handleError = (msg: string): void => {
    setHasError(true);
    setMsgError(msg);
    setIsLoading(false);
    setTimeout(() => {
      setHasError(false);
      setMsgError("");
    }, ERROR_TIME_AWAIT);
  };

  return (
    <div className="h-screen flex overflow-y-hidden">
      <StyledSidebar>
        <StyledContainer>
          <div></div>
          <div>
            <Logo />
          </div>
          <div className="flex flex-column items-center justify-center">
            <div className="flex flex-column items-center justify-center gap-2">
              <LabelTitle
                text="E-mail"
                htmlFor="email"
                className="font-semibold"
              />
              <InputText
                type="text"
                onChange={(e) => {
                  setLogin({ ...login, username: e.target.value });
                  setInvalidUsername(false);
                  setInvalidUsername(false);
                }}
              />
            </div>
            <div className="flex flex-column items-center justify-center gap-2">
              <LabelTitle
                text="Senha"
                htmlFor="password"
                className="font-semibold"
              />
              <span className="p-input-icon-right w-full">
                <i
                  className={showPassword ? "pi pi-eye" : "pi pi-eye-slash"}
                  onClick={() => setShowPassword(!showPassword)}
                />
                <InputText
                  type={showPassword ? "text" : "password"}
                  onChange={(e) => {
                    setLogin({ ...login, password: e.target.value });
                    setInvalidUsername(false);
                    setInvalidUsername(false);
                  }}
                ></InputText>
              </span>
              {hasError && <Message severity="error" text={msg} />}
              <Button
                label="Esqueci a senha"
                className="p-button-link"
                style={{
                  fontSize: "14px",
                  textAlign: "left",
                  padding: "0",
                }}
              />
            </div>
            <Button
              className="w-full"
              label="Acessar"
              onClick={() => validateFields()}
              style={{
                backgroundColor: "var(--cor-primaria)",
                border: "1px solid var(--cor-primaria)",
              }}
            />
          </div>
          <div></div>
        </StyledContainer>
      </StyledSidebar>
      <main className="flex-1">
        <div className="h-full relative"></div>
      </main>
    </div>
  );
}
