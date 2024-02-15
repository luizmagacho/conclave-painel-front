import LabelTitle from "@/components/LabelTitle";
import { UserRequestDTO } from "@/services/user/type";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import { useState } from "react";

interface UserCreateDialog {
  visible: boolean;
  onHide: () => void;
  onCreate: (user: UserRequestDTO) => void;
}

function UserCreateDialog({ visible, onHide, onCreate }: UserCreateDialog) {
  const [newUser, setNewUser] = useState<UserRequestDTO>({
    name: "",
    username: "",
    department: "",
    password: "",
  });
  const [invalidName, setInvalidName] = useState<boolean>(false);
  const [invalidUsername, setInvalidUsername] = useState<boolean>(false);
  const [invalidDeparment, setInvalidDepartment] = useState<boolean>(false);
  const [invalidPassword, setInvalidPassword] = useState<boolean>(false);

  function validateFields() {
    setInvalidName(!newUser.name || newUser.name === "");
    setInvalidUsername(!newUser.username || newUser.username === "");
    setInvalidDepartment(!newUser.department || newUser.department === "");
    setInvalidPassword(!newUser.password || newUser.password === "");

    if (
      !invalidName ||
      !invalidUsername ||
      !invalidDeparment ||
      !invalidPassword
    ) {
      onCreate(newUser);
      onHide();
    }
  }

  return (
    <Dialog
      header="Adicionar Novo Usuário"
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
              setNewUser({ ...newUser, name: e.target.value });
              setInvalidName(false);
            }}
            value={newUser?.name}
          />
          {invalidName && (
            <Message severity="error" text="Nome é obrigatório" />
          )}
        </div>
      </div>
      <div className="flex gap-2">
        <Button className="w-full" label="Cancelar" outlined onClick={onHide} />
        <Button
          className="w-full"
          label="Salvar"
          severity="danger"
          onClick={() => validateFields()}
        />
      </div>
    </Dialog>
  );
}

export default UserCreateDialog;
