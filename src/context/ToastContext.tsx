import React, { createContext, useState, useEffect, ReactNode } from "react";

interface ProviderProps {
  children: ReactNode;
}

interface ToastContextProps {
  showToast: boolean;
  setShowToast: React.Dispatch<React.SetStateAction<boolean>>;
  toastMessage: string;
  showSuccessToast: (message: string) => void;
  showInfoToast: (message: string) => void;
  showErrorToast: (message: string) => void;
}

export const ToastContext = createContext({} as ToastContextProps);

export const ToastProvider = ({ children }: ProviderProps) => {
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");

  useEffect(() => {
    // Esconde a notificação automaticamente após um tempo
    const timeoutId = setTimeout(() => {
      setShowToast(false);
    }, 5000);

    return () => clearTimeout(timeoutId);
  }, [showToast]);

  async function showSuccessToast(message: string) {
    await setShowToast(true);
    setToastMessage(message);
  }

  function showInfoToast(message: string) {
    setShowToast(true);
    setToastMessage(message);
  }

  function showErrorToast(message: string) {
    setShowToast(true);
    setToastMessage(message);
  }

  return (
    <ToastContext.Provider
      value={{
        showToast,
        setShowToast,
        toastMessage,
        showSuccessToast,
        showInfoToast,
        showErrorToast,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
};
