import { resetPassword } from "@/services/auth/passwordReset";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import { useRouter } from "next/router";
import { useState } from "react";

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

  // Inline validation
  const [invalidNewPassword, setInvalidNewPassword] = useState(false);
  const [invalidConfirmPassword, setInvalidConfirmPassword] = useState(false);

  async function handleSubmit() {
    const isNewPasswordEmpty = !newPassword || newPassword.length < 6;
    const isConfirmMismatch = newPassword !== confirmPassword;

    setInvalidNewPassword(isNewPasswordEmpty);
    setInvalidConfirmPassword(isConfirmMismatch);

    if (isNewPasswordEmpty || isConfirmMismatch) return;
    if (!token || typeof token !== "string") {
      setErrorMessage("Invalid reset link. Please request a new one.");
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
        "This reset link is invalid or has expired. Please request a new one."
      );
    }
  }

  const cardStyle: React.CSSProperties = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
  };

  const panelStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    backdropFilter: "blur(20px)",
    borderRadius: "16px",
    padding: "2.5rem 2rem",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 25px 60px rgba(0,0,0,0.4)",
  };

  const labelStyle: React.CSSProperties = {
    color: "rgba(255,255,255,0.7)",
    fontSize: "0.82rem",
    fontWeight: 600,
  };

  const inputStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.15)",
    color: "#fff",
    borderRadius: "8px",
    height: "42px",
    fontSize: "0.9rem",
    width: "100%",
    paddingRight: "2.5rem",
  };

  // ── Success state ──────────────────────────────────────────────────────────
  if (state === "success") {
    return (
      <div style={cardStyle}>
        <div style={panelStyle}>
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
              style={{ color: "#fff", fontSize: "1.3rem", fontWeight: 700, margin: 0 }}
            >
              Password Updated!
            </h1>
            <p
              style={{
                color: "rgba(255,255,255,0.6)",
                fontSize: "0.88rem",
                marginTop: "0.5rem",
                lineHeight: 1.6,
              }}
            >
              Your password has been reset successfully. You can now log in with
              your new password.
            </p>
            <Button
              id="go-to-login"
              label="Go to Login"
              className="w-full mt-3"
              style={{
                background: "linear-gradient(135deg, #e53e3e, #c53030)",
                border: "none",
                borderRadius: "8px",
                height: "42px",
                fontWeight: 700,
              }}
              onClick={() => router.push("/")}
            />
          </div>
        </div>
      </div>
    );
  }

  // ── Error state ────────────────────────────────────────────────────────────
  if (state === "error") {
    return (
      <div style={cardStyle}>
        <div style={panelStyle}>
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
              style={{ color: "#fff", fontSize: "1.3rem", fontWeight: 700, margin: 0 }}
            >
              Link Expired
            </h1>
            <p
              style={{
                color: "rgba(255,255,255,0.6)",
                fontSize: "0.88rem",
                marginTop: "0.5rem",
                lineHeight: 1.6,
              }}
            >
              {errorMessage}
            </p>
            <Button
              id="request-new-link"
              label="Request New Link"
              className="w-full mt-3"
              style={{
                background: "linear-gradient(135deg, #e53e3e, #c53030)",
                border: "none",
                borderRadius: "8px",
                height: "42px",
                fontWeight: 700,
              }}
              onClick={() => router.push("/forgot-password")}
            />
          </div>
        </div>
      </div>
    );
  }

  // ── Form state ─────────────────────────────────────────────────────────────
  return (
    <div style={cardStyle}>
      <div style={panelStyle}>
        {/* Header */}
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
            <i className="pi pi-key" style={{ fontSize: "1.4rem", color: "#fff" }} />
          </div>
          <h1
            style={{ color: "#fff", fontSize: "1.4rem", fontWeight: 700, margin: 0 }}
          >
            Set New Password
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.55)",
              fontSize: "0.85rem",
              marginTop: "0.5rem",
            }}
          >
            Choose a strong password for your account.
          </p>
        </div>

        {/* New Password */}
        <div className="field flex flex-column gap-2" style={{ marginBottom: "1rem" }}>
          <label htmlFor="newPassword" style={labelStyle}>
            New Password
          </label>
          <div style={{ position: "relative" }}>
            <InputText
              id="newPassword"
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setInvalidNewPassword(false);
              }}
              placeholder="At least 6 characters"
              style={inputStyle}
            />
            <i
              className={showNewPassword ? "pi pi-eye" : "pi pi-eye-slash"}
              onClick={() => setShowNewPassword((v) => !v)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "rgba(255,255,255,0.4)",
                cursor: "pointer",
                fontSize: "0.9rem",
              }}
            />
          </div>
          {invalidNewPassword && (
            <Message
              severity="error"
              text="Password must be at least 6 characters."
              style={{ fontSize: "0.8rem" }}
            />
          )}
        </div>

        {/* Confirm Password */}
        <div className="field flex flex-column gap-2" style={{ marginBottom: "1.25rem" }}>
          <label htmlFor="confirmPassword" style={labelStyle}>
            Confirm Password
          </label>
          <div style={{ position: "relative" }}>
            <InputText
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setInvalidConfirmPassword(false);
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Repeat your new password"
              style={inputStyle}
            />
            <i
              className={showConfirmPassword ? "pi pi-eye" : "pi pi-eye-slash"}
              onClick={() => setShowConfirmPassword((v) => !v)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "rgba(255,255,255,0.4)",
                cursor: "pointer",
                fontSize: "0.9rem",
              }}
            />
          </div>
          {invalidConfirmPassword && (
            <Message
              severity="error"
              text="Passwords do not match."
              style={{ fontSize: "0.8rem" }}
            />
          )}
        </div>

        <Button
          id="reset-password-submit"
          label="Reset Password"
          loading={state === "loading"}
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
      </div>
    </div>
  );
}
