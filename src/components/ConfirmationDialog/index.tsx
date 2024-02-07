import React from "react";
import { confirmDialog } from "primereact/confirmdialog";
import { Button } from "primereact/button";

/**
 * Componente de confirmação genérica.
 *
 * @param {Object} props - As props para o componente de confirmação.
 * @param {string} props.message - A mensagem de confirmação.
 * @param {string} props.header - O cabeçalho da janela de confirmação.
 * @param {string} props.icon - O ícone a ser exibido na janela de confirmação.
 * @param {string} props.acceptLabel - O rótulo para o botão "Sim".
 * @param {string} props.rejectLabel - O rótulo para o botão "Não".
 * @param {Function} props.onConfirm - A função a ser executada quando a confirmação for aceita.
 */

interface ConfirmationDialogProps {
  message: string;
  header: string;
  icon?: string;
  acceptLabel: string;
  rejectLabel: string;
  onConfirm: () => void;
}

function ConfirmationDialog({
  message,
  header,
  icon = "pi pi-info-circle",
  acceptLabel,
  rejectLabel,
  onConfirm,
}: ConfirmationDialogProps) {
  const handleConfirm = () => {
    confirmDialog({
      message,
      header,
      icon,
      acceptClassName: "p-button-danger",
      accept: onConfirm,
      acceptLabel,
      rejectLabel,
    });
  };

  return (
    <Button
      severity="danger"
      icon="pi pi-sign-out"
      onClick={handleConfirm}
      label="Sair"
    />
  );
}

export default ConfirmationDialog;
