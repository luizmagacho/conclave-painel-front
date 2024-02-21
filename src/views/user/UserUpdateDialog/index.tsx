import LabelTitle from "@/components/LabelTitle";
import { User } from "@/services/user/type";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import { useState } from "react";

interface UserUpdateDialog {
  visible: boolean;
  onHide: () => void;
  onUpdate: (user: User) => void;
  data: User;
}

function UserUpdateDialog({
  visible,
  onHide,
  onUpdate,
  data,
}: UserUpdateDialog) {
  const [updatedUser, setUpdatedUser] = useState<User>({
    id: data.id,
    name: data.name,
    username: data.username,
    department: data.department,
    role: data.role,
    profile: data.profile,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  });
  const [invalidName, setInvalidName] = useState<boolean>(false);
  const [invalidUsername, setInvalidUsername] = useState<boolean>(false);
  const [invalidDeparment, setInvalidDepartment] = useState<boolean>(false);
  const [invalidPassword, setInvalidPassword] = useState<boolean>(false);

  function validateFields() {
    setInvalidName(!updatedUser.name || updatedUser.name === "");
    setInvalidUsername(!updatedUser.username || updatedUser.username === "");
    setInvalidDepartment(
      !updatedUser.department || updatedUser.department === ""
    );

    if (
      !invalidName ||
      !invalidUsername ||
      !invalidDeparment ||
      !invalidPassword
    ) {
      onUpdate(updatedUser);
      onHide();
    }
  }

  return (
    <Dialog
      header="Atualizar Usuário"
      visible={visible}
      onHide={onHide}
      className="w-25rem"
    >
      <div>
        <div className="field flex flex-column gap-2">
          <LabelTitle
            text="Nome"
            htmlFor="name"
            className="font-semibold"
            required={true}
          />
          <InputText
            type="text"
            onChange={(e) => {
              setUpdatedUser({ ...updatedUser, name: e.target.value });
              setInvalidName(false);
            }}
            value={updatedUser.name}
          />
          {invalidName && (
            <Message severity="error" text="Nome é obrigatório" />
          )}
        </div>
        <div className="field flex flex-column gap-2">
          <LabelTitle
            text="E-mail"
            htmlFor="username"
            className="font-semibold"
            required={true}
          />
          <InputText
            type="text"
            onChange={(e) => {
              setUpdatedUser({ ...updatedUser, username: e.target.value });
              setInvalidUsername(false);
            }}
            value={updatedUser.username}
          />
          {invalidUsername && (
            <Message severity="error" text="E-mail é obrigatório" />
          )}
        </div>
      </div>
      <div className="flex gap-2">
        <Button className="w-full" label="Cancelar" outlined onClick={onHide} />
        <Button
          className="w-full"
          label="Atualizar"
          severity="danger"
          onClick={() => validateFields()}
        />
      </div>
    </Dialog>
  );
}

export default UserUpdateDialog;
