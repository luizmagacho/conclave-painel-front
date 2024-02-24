import LabelTitle from "@/components/LabelTitle";
import { Profile } from "@/services/profile/type";
import { UserRequestDTO } from "@/services/user/type";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";
import { useEffect, useState } from "react";

interface UserCreateDialog {
  visible: boolean;
  onHide: () => void;
  onCreate: (user: UserRequestDTO) => void;
  profiles: Profile[];
}

function UserCreateDialog({
  visible,
  onHide,
  onCreate,
  profiles,
}: UserCreateDialog) {
  const [newUser, setNewUser] = useState<UserRequestDTO>({
    name: "",
    username: "",
    department: "",
    password: "",
    profile: [],
  });
  const [invalidName, setInvalidName] = useState<boolean>(false);
  const [invalidUsername, setInvalidUsername] = useState<boolean>(false);
  const [invalidDeparment, setInvalidDepartment] = useState<boolean>(false);
  const [invalidPassword, setInvalidPassword] = useState<boolean>(false);
  const [invalidProfile, setInvalidProfile] = useState<boolean>(false);
  const [newProfiles, setNewProfiles] = useState<Profile[]>([]);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  useEffect(() => {
    setNewUser((prevUser) => ({
      ...prevUser,
      profile: [],
    }));
    if (newProfiles && Array.isArray(newProfiles) && newProfiles.length > 0) {
      setNewUser((prevUser) => ({
        ...prevUser,
        profiles: [...prevUser.profile, ...newProfiles],
      }));
    }
  }, [profiles]);

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
        <div className="field flex flex-column gap-2">
          <LabelTitle
            text="E-mail"
            htmlFor="create_username"
            className="font-semibold"
            required={true}
          />
          <InputText
            type="text"
            onChange={(e) => {
              setNewUser({ ...newUser, username: e.target.value });
              setInvalidUsername(false);
            }}
            value={newUser.username}
          />
          {invalidName && (
            <Message severity="error" text="E-mail é obrigatório" />
          )}
        </div>
        <div className="field flex flex-column gap-2">
          <LabelTitle
            text="Senha"
            htmlFor="create_password"
            className="font-semibold"
            required={true}
          />
          <div className="card">
            <span className="p-input-icon-right w-full">
              <i
                className={showPassword ? "pi pi-eye" : "pi pi-eye-slash"}
                onClick={() => setShowPassword(!showPassword)}
              />
              <InputText
                className="w-full"
                type={showPassword ? "text" : "password"}
                onChange={(e) => {
                  setNewUser({ ...newUser, password: e.target.value });
                  setInvalidPassword(false);
                }}
                value={newUser.password}
              />
            </span>
          </div>
          {invalidPassword && (
            <Message severity="error" text="Senha é obrigatória" />
          )}
        </div>
        <div className="field flex flex-column gap-2">
          <LabelTitle
            text="Departamento"
            htmlFor="department"
            className="font-semibold"
          />

          <InputText
            type="text"
            onChange={(e) => {
              setNewUser({ ...newUser, department: e.target.value });
              setInvalidDepartment(false);
            }}
            value={newUser?.department}
          />
          {invalidDeparment && (
            <Message severity="error" text="Departamento é obrigatório" />
          )}
        </div>

        <div className="field flex flex-column gap-2">
          <LabelTitle
            text="Perfil"
            htmlFor="profile"
            className="font-semibold"
            required={true}
          />
          <MultiSelect
            value={newProfiles}
            optionLabel="name"
            placeholder="Escolha"
            display="chip"
            options={profiles}
            onChange={(e: MultiSelectChangeEvent) => {
              setNewProfiles(e.value);
              setInvalidProfile(false);
            }}
          />
          {invalidProfile && (
            <Message severity="error" text="Selecione pelo menos um perfil" />
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
