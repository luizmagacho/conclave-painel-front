import { requestPasswordReset } from "@/services/auth/passwordReset";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import { useRouter } from "next/router";
import { useState } from "react";

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
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(20px)",
          borderRadius: "16px",
          padding: "2.5rem 2rem",
          width: "100%",
          maxWidth: "420px",
          boxShadow: "0 25px 60px rgba(0,0,0,0.4)",
        }}
      >
        {/* Icon + Title */}
        <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #e53e3e, #c53030)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1rem",
              boxShadow: "0 8px 24px rgba(229,62,62,0.4)",
            }}
          >
            <i className="pi pi-lock" style={{ fontSize: "1.4rem", color: "#fff" }} />
          </div>
          <h1
            style={{
              color: "#fff",
              fontSize: "1.4rem",
              fontWeight: 700,
              margin: 0,
            }}
          >
            Forgot Your Password?
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.55)",
              fontSize: "0.85rem",
              marginTop: "0.5rem",
            }}
          >
            Enter your email and we'll send you a reset link.
          </p>
        </div>

        {submitted ? (
          /* ── Success state ── */
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
                color: "rgba(255,255,255,0.8)",
                fontSize: "0.9rem",
                lineHeight: 1.6,
              }}
            >
              If that email is registered, you'll receive a reset link shortly.
              Check your inbox (and spam folder).
            </p>
            <Button
              label="Back to Login"
              outlined
              className="w-full mt-3"
              style={{ borderColor: "rgba(255,255,255,0.2)", color: "#fff" }}
              onClick={() => router.push("/")}
            />
          </div>
        ) : (
          /* ── Form state ── */
          <>
            <div className="field flex flex-column gap-2" style={{ marginBottom: "1rem" }}>
              <label
                htmlFor="email"
                style={{
                  color: "rgba(255,255,255,0.7)",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                }}
              >
                Email address
              </label>
              <InputText
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setInvalidEmail(false);
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="you@example.com"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "#fff",
                  borderRadius: "8px",
                  height: "42px",
                  fontSize: "0.9rem",
                }}
              />
              {invalidEmail && (
                <Message
                  severity="error"
                  text="Please enter a valid email address."
                  style={{ fontSize: "0.8rem" }}
                />
              )}
            </div>

            <Button
              id="send-reset-link"
              label="Send Reset Link"
              loading={loading}
              onClick={handleSubmit}
              className="w-full"
              style={{
                background: "linear-gradient(135deg, #e53e3e, #c53030)",
                border: "none",
                borderRadius: "8px",
                height: "42px",
                fontWeight: 700,
                fontSize: "0.9rem",
                marginBottom: "1rem",
              }}
            />

            <div style={{ textAlign: "center" }}>
              <Button
                label="Back to Login"
                className="p-button-link"
                style={{
                  color: "rgba(255,255,255,0.5)",
                  fontSize: "0.82rem",
                  padding: 0,
                }}
                onClick={() => router.push("/")}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
