import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

import LabelTitle from "@/components/LabelTitle";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { LoginDTO } from "@/services/user/type";
import { AuthContext } from "@/context/AuthContext";
import { Message } from "primereact/message";
import { Logo } from "@/views/common";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";

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
  const router = useRouter();

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
    <div 
      className="h-screen w-full flex align-items-center justify-content-center" 
      style={{ backgroundColor: "#f8fafc" }}
    >
      <div 
        className="card flex flex-column p-5" 
        style={{ 
          width: "100%", 
          maxWidth: "420px", 
          borderRadius: "12px", 
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          backgroundColor: "#ffffff"
        }}
      >
        <div className="flex justify-content-center mb-5">
          <Logo redirect="/" />
        </div>
        
        <div className="flex flex-column gap-4">
          <div className="field flex flex-column gap-2 mb-0">
            <LabelTitle
              text="E-mail"
              htmlFor="email"
              className="font-semibold"
            />
            <InputText
              type="text"
              className="w-full"
              placeholder="Digite seu e-mail"
              onChange={(e) => {
                setLogin({ ...login, username: e.target.value });
                setInvalidUsername(false);
              }}
            />
            {invalidUsername && <Message severity="error" text="E-mail é obrigatório" />}
          </div>
          
          <div className="field flex flex-column gap-2 mb-0">
            <LabelTitle
              text="Senha"
              htmlFor="password"
              className="font-semibold"
            />
            <IconField iconPosition="right" className="w-full">
              <InputIcon
                onClick={() => setShowPassword(!showPassword)}
                className={showPassword ? "pi pi-eye" : "pi pi-eye-slash"}
                style={{ cursor: "pointer" }}
              />
              <InputText
                type={showPassword ? "text" : "password"}
                className="w-full"
                placeholder="Digite sua senha"
                onChange={(e) => {
                  setLogin({ ...login, password: e.target.value });
                  setInvalidPassword(false);
                }}
              />
            </IconField>
            {invalidPassword && <Message severity="error" text="Senha é obrigatória" />}
            
            <div className="flex justify-content-end w-full mt-1">
              <Button
                id="forgot-password"
                label="Esqueci a senha"
                className="p-button-link text-sm m-0 p-0"
                onClick={() => router.push("/forgot-password")}
              />
            </div>
          </div>
          
          {hasError && <Message severity="error" text={msgError} />}
          
          <Button
            className="w-full mt-2"
            label={loading ? "Acessando..." : "Acessar"}
            onClick={() => validateFields()}
            disabled={loading}
            style={{
              backgroundColor: "var(--cor-primaria)",
              border: "1px solid var(--cor-primaria)",
              padding: "0.75rem"
            }}
          />
        </div>
      </div>
    </div>
  );
}
