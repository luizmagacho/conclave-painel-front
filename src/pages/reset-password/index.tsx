import { resetPassword } from "@/services/auth/passwordReset";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import { useRouter } from "next/router";
import { useState } from "react";
import LabelTitle from "@/components/LabelTitle";
import { Logo } from "@/views/common";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";

type ResetState = "idle" | "loading" | "success" | "error";

export default function ResetPassword() {
  const router = useRouter();
  const { token } = router.query;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [state, setState] = useState<ResetState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const [invalidNewPassword, setInvalidNewPassword] = useState(false);
  const [invalidConfirmPassword, setInvalidConfirmPassword] = useState(false);

  async function handleSubmit() {
    const isNewPasswordEmpty = !newPassword || newPassword.length < 6;
    const isConfirmMismatch = newPassword !== confirmPassword;

    setInvalidNewPassword(isNewPasswordEmpty);
    setInvalidConfirmPassword(isConfirmMismatch);

    if (isNewPasswordEmpty || isConfirmMismatch) return;
    if (!token || typeof token !== "string") {
      setErrorMessage("Link de recuperação inválido. Por favor, solicite um novo.");
      setState("error");
      return;
    }

    setState("loading");
    try {
      await resetPassword(token, newPassword);
      setState("success");
    } catch {
      setState("error");
      setErrorMessage(
        "Este link de recuperação é inválido ou expirou. Por favor, solicite um novo."
      );
    }
  }

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

        {state === "success" && (
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: "rgba(72,187,120,0.15)",
                border: "2px solid #48bb78",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1rem",
              }}
            >
              <i
                className="pi pi-check"
                style={{ fontSize: "1.4rem", color: "#48bb78" }}
              />
            </div>
            <h1
              style={{ color: "var(--text-color)", fontSize: "1.3rem", fontWeight: 700, margin: 0 }}
            >
              Senha Atualizada!
            </h1>
            <p
              style={{
                color: "var(--text-color-secondary)",
                fontSize: "0.88rem",
                marginTop: "0.5rem",
                lineHeight: 1.6,
                marginBottom: "1.5rem"
              }}
            >
              Sua senha foi redefinida com sucesso. Você já pode fazer login com sua nova senha.
            </p>
            <Button
              id="go-to-login"
              label="Ir para o Login"
              className="w-full mt-3"
              style={{
                backgroundColor: "var(--cor-primaria)",
                border: "1px solid var(--cor-primaria)",
                padding: "0.75rem"
              }}
              onClick={() => router.push("/")}
            />
          </div>
        )}

        {state === "error" && (
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: "rgba(229,62,62,0.15)",
                border: "2px solid #e53e3e",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1rem",
              }}
            >
              <i
                className="pi pi-times"
                style={{ fontSize: "1.4rem", color: "#e53e3e" }}
              />
            </div>
            <h1
              style={{ color: "var(--text-color)", fontSize: "1.3rem", fontWeight: 700, margin: 0 }}
            >
              Link Expirado
            </h1>
            <p
              style={{
                color: "var(--text-color-secondary)",
                fontSize: "0.88rem",
                marginTop: "0.5rem",
                lineHeight: 1.6,
                marginBottom: "1.5rem"
              }}
            >
              {errorMessage}
            </p>
            <Button
              id="request-new-link"
              label="Solicitar Novo Link"
              className="w-full mt-3"
              style={{
                backgroundColor: "var(--cor-primaria)",
                border: "1px solid var(--cor-primaria)",
                padding: "0.75rem"
              }}
              onClick={() => router.push("/forgot-password")}
            />
          </div>
        )}

        {state !== "success" && state !== "error" && (
          <div className="flex flex-column gap-4">
            <div style={{ textAlign: "center", marginBottom: "0.5rem" }}>
              <h1
                style={{ color: "var(--text-color)", fontSize: "1.4rem", fontWeight: 700, margin: 0 }}
              >
                Definir Nova Senha
              </h1>
              <p
                style={{
                  color: "var(--text-color-secondary)",
                  fontSize: "0.85rem",
                  marginTop: "0.5rem",
                }}
              >
                Escolha uma senha forte para a sua conta.
              </p>
            </div>

            <div className="field flex flex-column gap-2 mb-0">
              <LabelTitle
                text="Nova Senha"
                htmlFor="newPassword"
                className="font-semibold"
              />
              <IconField iconPosition="right" className="w-full">
                <InputIcon
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className={showNewPassword ? "pi pi-eye" : "pi pi-eye-slash"}
                  style={{ cursor: "pointer" }}
                />
                <InputText
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  className="w-full"
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setInvalidNewPassword(false);
                  }}
                  placeholder="Pelo menos 6 caracteres"
                />
              </IconField>
              {invalidNewPassword && (
                <Message severity="error" text="A senha deve ter pelo menos 6 caracteres." />
              )}
            </div>

            <div className="field flex flex-column gap-2 mb-0">
              <LabelTitle
                text="Confirmar Senha"
                htmlFor="confirmPassword"
                className="font-semibold"
              />
              <IconField iconPosition="right" className="w-full">
                <InputIcon
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={showConfirmPassword ? "pi pi-eye" : "pi pi-eye-slash"}
                  style={{ cursor: "pointer" }}
                />
                <InputText
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  className="w-full"
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setInvalidConfirmPassword(false);
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  placeholder="Repita sua nova senha"
                />
              </IconField>
              {invalidConfirmPassword && (
                <Message severity="error" text="As senhas não coincidem." />
              )}
            </div>

            <Button
              id="reset-password-submit"
              label="Redefinir Senha"
              loading={state === "loading"}
              onClick={handleSubmit}
              className="w-full mt-2"
              style={{
                backgroundColor: "var(--cor-primaria)",
                border: "1px solid var(--cor-primaria)",
                padding: "0.75rem"
              }}
            />

            <div className="flex justify-content-center w-full mt-1">
              <Button
                label="Voltar para o Login"
                className="p-button-link text-sm m-0 p-0"
                onClick={() => router.push("/")}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
