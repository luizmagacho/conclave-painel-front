import LabelTitle from "@/components/LabelTitle";
import { Profile, Role } from "@/services/profile/type";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";
import { useEffect, useState } from "react";

interface ProfileUpdateDialog {
  roles: Role[];
  visible: boolean;
  onHide: () => void;
  onUpdate: (profile: Profile) => void;
  data: Profile;
}

function ProfileUpdateDialog({
  roles,
  visible,
  onHide,
  onUpdate,
  data,
}: ProfileUpdateDialog) {
  const [editProfile, setEditProfile] = useState<Profile>({
    id: data.id,
    name: data.name,
    roles: data.roles,
  });
  const [newRoles, setNewRoles] = useState<Role[]>(data.roles || []); // Inicializa com os papéis existentes
  const [invalidName, setInvalidName] = useState<boolean>(false);
  const [invalidRole, setInvalidRole] = useState<boolean>(false);

  useEffect(() => {
    setEditProfile((prevProfile) => ({
      ...prevProfile,
      roles: newRoles,
    }));
  }, [newRoles]);

  function validateFields() {
    if (!editProfile.name || editProfile.name === "") {
      setInvalidName(true);
    } else if (newRoles.length === 0) {
      setInvalidRole(true);
    } else {
      onUpdate(editProfile);
      onHide();
    }
  }
  return (
    <Dialog
      header="Editar perfil"
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
              setEditProfile({ ...editProfile, name: e.target.value });
              setInvalidName(false);
            }}
            value={editProfile?.name}
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
            optionLabel="name" // Especifica o campo a ser exibido
            options={roles}
            placeholder="Escolha"
            display="chip"
            onChange={(e: MultiSelectChangeEvent) => {
              setNewRoles(e.value);
              setInvalidRole(false);
            }}
          />
          {invalidRole && (
            <Message severity="error" text="Selecione pelo menos uma opção" />
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

export default ProfileUpdateDialog;
