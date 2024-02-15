import LabelTitle from "@/components/LabelTitle";
import { UserContext } from "@/context/UserContext";
import { User, UserChangePasswordRequest } from "@/services/user/type";
import Cookies from "js-cookie";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useContext, useState } from "react";

function UserChangePassword() {
  const id = Cookies.get("portal.id");
  const name = Cookies.get("portal.name");
  const [updatedUser, setUpdatedUser] = useState<UserChangePasswordRequest>({
    id: id || "",
    password: "",
  });
  const [newPassword, setNewPassword] = useState<string>("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState<string>("");

  const [invalidNewPassword, setInvalidNewPassword] = useState<boolean>(false);
  const [invalidPasswordConfirm, setInvalidPasswordConfirm] =
    useState<boolean>(false);
  const [invalidSamePassword, setInvalidSamePassword] =
    useState<boolean>(false);
  const { handleChangePassword } = useContext(UserContext);

  function validateFields() {
    setInvalidNewPassword(!newPassword || newPassword === "");
    setInvalidPasswordConfirm(!newPasswordConfirm || newPasswordConfirm === "");

    setInvalidSamePassword(newPassword !== newPasswordConfirm);

    if (!invalidNewPassword || !invalidPasswordConfirm) {
      handleChangePassword(updatedUser);
    }
  }

  return (
    <>
      <section className="flex flex-column gap-4 p-5 w-full">
        <div className="flex align-items-center justify-start w-full gap-2">
          <h1 className="m-0">Usuário: ${name}</h1>
        </div>
        <div className="field flex flex-column gap-2">
          <LabelTitle
            text="Nova Senha"
            htmlFor="newPassword"
            className="font-semibold"
            required={true}
          />
          <InputText
            type="password"
            onChange={(e) => {
              setNewPassword(e.target.value);
            }}
            value={newPassword}
          />
        </div>
        <div className="field flex flex-column gap-2">
          <LabelTitle
            text="Confirme Nova Senha"
            htmlFor="newPasswordConfirm"
            className="font-semibold"
            required={true}
          />
          <InputText
            type="password"
            onChange={(e) => {
              setNewPasswordConfirm(e.target.value);
            }}
            value={newPasswordConfirm}
          />
        </div>
        <div className="flex gap-2">
          <Button
            className="w-full"
            label="Salvar"
            severity="danger"
            onClick={() => validateFields()}
          />
        </div>
      </section>
    </>
  );
}

export default UserChangePassword;
