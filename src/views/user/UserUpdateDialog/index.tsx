import LabelTitle from "@/components/LabelTitle";
import { Profile } from "@/services/profile/type";
import { User } from "@/services/user/type";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";
import { useEffect, useState } from "react";

interface UserUpdateDialog {
  visible: boolean;
  onHide: () => void;
  onUpdate: (user: User) => void;
  data: User;
  profiles: Profile[];
}

function UserUpdateDialog({
  visible,
  onHide,
  onUpdate,
  data,
  profiles,
}: UserUpdateDialog) {
  const [updatedUser, setUpdatedUser] = useState<User>({
    id: data.id,
    name: data.name,
    username: data.username,
    password: "",
    department: data.department,
    role: data.role,
    profiles: data.profiles,
    highestPriorityRole: data.highestPriorityRole,
    profilesName: data.profilesName,
    createdAt: data.createdAt,
    createdAtFormat: data.createdAtFormat,
    updatedAt: data.updatedAt,
  });
  const [updatedProfiles, setUpdatedProfiles] = useState<Profile[]>([]);
  const [invalidName, setInvalidName] = useState<boolean>(false);
  const [invalidUsername, setInvalidUsername] = useState<boolean>(false);
  const [invalidDeparment, setInvalidDepartment] = useState<boolean>(false);
  const [invalidPassword, setInvalidPassword] = useState<boolean>(false);
  const [invalidProfile, setInvalidProfile] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  useEffect(() => {
    if (data.profiles) {
      const selectedProfiles = profiles.filter((profile) =>
        data.profiles.some((profileData) => profileData.id === profile.id)
      );

      setUpdatedProfiles(selectedProfiles);
    }
  }, [data, profiles]);

  useEffect(() => {
    setUpdatedUser((prev) => ({
      ...prev,
      profiles: updatedProfiles,
    }));
  }, [updatedProfiles]);

  function validateFields() {
    setInvalidName(!updatedUser.name || updatedUser.name === "");
    setInvalidUsername(!updatedUser.username || updatedUser.username === "");
    setInvalidDepartment(
      !updatedUser.department || updatedUser.department === ""
    );
    setInvalidProfile(updatedUser.profiles.length === 0);

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
            disabled
          />
          {invalidUsername && (
            <Message severity="error" text="E-mail é obrigatório" />
          )}
        </div>
        <div className="field flex flex-column gap-2">
          <LabelTitle
            text="Senha"
            htmlFor="updated_password"
            className="font-semibold"
          />
          <IconField iconPosition="right">
            <InputIcon
              onClick={() => setShowPassword(!showPassword)}
              className={showPassword ? "pi pi-eye" : "pi pi-eye-slash"}
            >
              {" "}
            </InputIcon>
            <InputText
              className="w-full"
              type={showPassword ? "text" : "password"}
              onChange={(e) => {
                setUpdatedUser({ ...updatedUser, password: e.target.value });
                setInvalidPassword(false);
              }}
              value={updatedUser.password}
            />
          </IconField>
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
              setUpdatedUser({ ...updatedUser, department: e.target.value });
              setInvalidDepartment(false);
            }}
            value={updatedUser?.department}
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
            value={updatedProfiles}
            optionLabel="name"
            placeholder="Escolha"
            display="chip"
            options={profiles}
            onChange={(e: MultiSelectChangeEvent) => {
              setUpdatedProfiles(e.value);
              setInvalidProfile(false);
            }}
            disabled
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
          label="Atualizar"
          severity="danger"
          onClick={() => validateFields()}
        />
      </div>
    </Dialog>
  );
}

export default UserUpdateDialog;
