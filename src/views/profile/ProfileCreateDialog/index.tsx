import LabelTitle from "@/components/LabelTitle";
import { ProfileDTO, Role } from "@/services/profile/type";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";
import { useEffect, useState } from "react";

interface ProfileCreateDialog {
  roles: Role[];
  visible: boolean;
  onHide: () => void;
  onCreate: (profile: ProfileDTO) => void;
}

function ProfileCreateDialog({
  roles,
  visible,
  onHide,
  onCreate,
}: ProfileCreateDialog) {
  const [newProfile, setNewProfile] = useState<ProfileDTO>({
    name: "",
    permissions: [],
  });
  const [newRoles, setNewRoles] = useState<Role>();
  const [invalidName, setInvalidName] = useState<boolean>(false);
  const [invalidPermissions, setInvalidPermissions] = useState<boolean>(false);

  useEffect(() => {
    // Verifique se newRoles é definido antes de usar
    setNewProfile((prevProfile) => ({
      ...prevProfile,
      roles: [],
    }));
    if (newRoles && Array.isArray(newRoles) && newRoles.length > 0) {
      setNewProfile((prevProfile) => ({
        ...prevProfile,
        roles: [...prevProfile.permissions, ...newRoles],
      }));
    }
  }, [newRoles]);

  function validateFields() {
    setInvalidName(!newProfile.name || newProfile.name === "");
    setInvalidPermissions(
      !newProfile.permissions || newProfile.permissions.length === 0
    );
    if (
      newProfile.name &&
      newProfile.name !== "" &&
      newProfile.permissions &&
      newProfile.permissions.length > 0
    ) {
      onCreate(newProfile);
      onHide();
    }
  }

  return (
    <Dialog
      header="Adicionar Novo Perfil"
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
              setNewProfile({ ...newProfile, name: e.target.value });
              setInvalidName(false);
            }}
            value={setNewProfile?.name}
          />
          {invalidName && (
            <Message severity="error" text="Nome é obrigatório" />
          )}
        </div>
        <div className="field flex flex-column gap-2">
          <LabelTitle
            text="Papéis"
            htmlFor="roles"
            className="font-semibold"
            required={true}
          />
          <MultiSelect
            value={newRoles}
            optionLabel="name"
            options={roles}
            placeholder="Escolha"
            display="chip"
            onChange={(e: MultiSelectChangeEvent) => {
              setNewRoles(e.value);
              setInvalidPermissions(false);
            }}
          />
          {invalidPermissions && (
            <Message severity="error" text="Selecione pelo menos uma opção" />
          )}
        </div>
      </div>
      <div className="flex gap-2">
        <Button className="w-full" label="Cancelar" outlined onClick={onHide} />
        <Button
          onClick={() => validateFields()}
          className="w-full"
          label="Salvar"
          severity="danger"
        />
      </div>
    </Dialog>
  );
}
export default ProfileCreateDialog;
