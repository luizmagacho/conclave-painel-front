import { requestPasswordReset } from "@/services/auth/passwordReset";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import { useRouter } from "next/router";
import { useState } from "react";
import LabelTitle from "@/components/LabelTitle";
import { Logo } from "@/views/common";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [invalidEmail, setInvalidEmail] = useState(false);

  async function handleSubmit() {
    if (!email || !email.includes("@")) {
      setInvalidEmail(true);
      return;
    }
    setInvalidEmail(false);
    setLoading(true);
    try {
      await requestPasswordReset(email);
    } catch {
      // Swallow errors — always show the same success message to prevent
      // revealing whether an email is registered (anti-enumeration)
    } finally {
      setLoading(false);
      setSubmitted(true);
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

        {submitted ? (
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: "52px",
                height: "52px",
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
                style={{ fontSize: "1.3rem", color: "#48bb78" }}
              />
            </div>
            <p
              style={{
                color: "var(--text-color-secondary)",
                fontSize: "0.9rem",
                lineHeight: 1.6,
                marginBottom: "1.5rem"
              }}
            >
              Se este e-mail estiver cadastrado, você receberá um link de recuperação em breve.
              Verifique sua caixa de entrada (e a pasta de spam).
            </p>
            <Button
              label="Voltar para o Login"
              outlined
              className="w-full"
              style={{ color: "var(--cor-primaria)", borderColor: "var(--cor-primaria)" }}
              onClick={() => router.push("/")}
            />
          </div>
        ) : (
          <div className="flex flex-column gap-4">
            <div style={{ textAlign: "center", marginBottom: "0.5rem" }}>
              <h1
                style={{
                  color: "var(--text-color)",
                  fontSize: "1.4rem",
                  fontWeight: 700,
                  margin: 0,
                }}
              >
                Esqueceu sua Senha?
              </h1>
              <p
                style={{
                  color: "var(--text-color-secondary)",
                  fontSize: "0.85rem",
                  marginTop: "0.5rem",
                }}
              >
                Informe seu e-mail e enviaremos um link de recuperação.
              </p>
            </div>

            <div className="field flex flex-column gap-2 mb-0">
              <LabelTitle
                text="Endereço de e-mail"
                htmlFor="email"
                className="font-semibold"
              />
              <InputText
                id="email"
                type="email"
                value={email}
                className="w-full"
                onChange={(e) => {
                  setEmail(e.target.value);
                  setInvalidEmail(false);
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="voce@exemplo.com.br"
              />
              {invalidEmail && (
                <Message
                  severity="error"
                  text="Por favor, insira um endereço de e-mail válido."
                />
              )}
            </div>

            <Button
              id="send-reset-link"
              label="Enviar Link de Recuperação"
              loading={loading}
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
