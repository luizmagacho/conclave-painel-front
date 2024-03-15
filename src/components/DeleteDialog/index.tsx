import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

interface DeleteDialogProps {
  message: string;
  header: string;
  icon?: string;
  acceptLabel: string;
  rejectLabel: string;
  visible: boolean;
  onHide: () => void;
  onDelete: () => void;
}

function DeleteDialog({
  message,
  header,
  icon,
  acceptLabel,
  rejectLabel,
  visible,
  onHide,
  onDelete,
}: DeleteDialogProps) {
  return (
    <Dialog
      header={header}
      visible={visible}
      onHide={onHide}
      className="w-25rem"
    >
      <div className="card flex justify-content-center">
        <h4>{message}</h4>
      </div>
      <div className="flex gap-2">
        <Button
          className="w-full"
          label={rejectLabel}
          outlined
          onClick={onHide}
        />
        <Button
          className="w-full"
          label={acceptLabel}
          severity="danger"
          onClick={() => {
            onDelete();
            onHide();
          }}
        />
      </div>
    </Dialog>
  );
}
