import InputSearch from "@/components/InputSearch";
import { UserContext } from "@/context/UserContext";
import { User, UserRequestDTO } from "@/services/user/type";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
import { Toast } from "primereact/toast";
import { useContext, useRef, useState } from "react";
import UserCreateDialog from "../UserCreateDialog";
import UserUpdateDialog from "../UserUpdateDialog";
import UserDeleteDialog from "../UserDeleteDialog";
import { ProfileContext } from "@/context/ProfileContext";

interface Options {
  icon?: string;
  ariaLabel: string;
  tooltip?: string;
  label?: string;
  onclick: (user: User) => void;
}

interface OptionType {
  type: string;
}

const columns = [
  {
    field: "name",
    header: "Nome",
  },
  {
    field: "username",
    header: "E-mail",
  },
  {
    field: "profilesName",
    header: "Perfil",
  },

  {
    field: "createdAtFormat",
    header: "Criado em",
  },
];

function UserList() {
  const [currUser, setCurrUser] = useState<User | null>(null);
  const [currDeleteUser, setCurrDeleteUser] = useState<User | null>(null);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [nameSearch, setNameSearch] = useState<string>("");
  const [optionType, setOptionType] = useState<OptionType>({
    type: "Nome",
  });
  const [showCreateDialog, setShowCreateDialog] = useState<boolean>(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const {
    users,
    loading,
    totalElements,
    handleGetUsers,
    handlePostUser,
    handleUpdateUser,
    handleDeleteUser,
  } = useContext(UserContext);
  const { profiles, allProfiles } = useContext(ProfileContext);

  const toast = useRef<Toast>(null);
  const [first, setFirst] = useState<number>(0);

  const options: Options[] = [
    {
      ariaLabel: "Editar",
      label: "Editar",
      onclick: openDialog,
    },
    {
      ariaLabel: "Excluir",
      label: "Excluir",
      onclick: openDeleteDialog,
    },
  ];

  const columnBodyOptions = {
    options: (users: User) => optionsBodyTemplate(options, users),
  };

  async function onUpdateUser(user: User) {
    await handleUpdateUser(user);
    handleGetUsers();
  }

  function openDialog(user: User) {
    setCurrUser(user);
    setShowDialog(true);
  }

  function closeDialog() {
    setShowDialog((showDialog) => !showDialog);
    setCurrUser(null);
  }

  async function onCreateUser(userDTO: UserRequestDTO) {
    await handlePostUser(userDTO);
    handleGetUsers();
  }

  function openCreateDialog() {
    setShowCreateDialog(true);
  }

  function closeCreateDialog() {
    setShowCreateDialog((showCreateDialog) => !showCreateDialog);
  }

  async function onDeleteUser(userId: string) {
    await handleDeleteUser(userId);
    handleGetUsers();
  }

  function openDeleteDialog(user: User) {
    setCurrDeleteUser(user);
    setShowDeleteDialog(true);
  }

  function closeDeleteDialog() {
    setCurrDeleteUser(null);
    setShowDeleteDialog((showDeleteDialog) => !showDeleteDialog);
  }

  function onPageChange(event: PaginatorPageChangeEvent) {
    const { page, first } = event;
    handleGetUsers(page);
    setFirst(first);
  }

  function onSearch(name: string) {
    handleGetUsers(0, name);
  }

  function onChangeSearch(name: string) {
    setNameSearch(name);
  }

  return (
    <>
      <section className="flex flex-column gap-4 p-5 w-full">
        <div className="flex align-items-center justify-start w-full gap-2">
          <h1 className="m-0">Usuários</h1>
          <InputSearch
            onSearch={onSearch}
            onChange={onChangeSearch}
            inputType={optionType.type}
          />
          <Button
            style={{
              backgroundColor: "var(--cor-primaria)",
              border: "1px solid var(--cor-primaria)",
            }}
            onClick={() => {
              setShowCreateDialog(true);
            }}
          >
            Adicionar
          </Button>
        </div>
        <DataTable
          emptyMessage="Nenhuma usuário encontrado."
          value={users}
          loading={loading}
          stripedRows
          showGridlines
          scrollable
          scrollHeight="85vh"
          rows={15}
          totalRecords={totalElements}
          tableStyle={{ minWidth: "50rem" }}
          size="small"
          className="smaller-text"
        >
          {columns.map((col) => {
            return (
              <Column
                sortable
                key={col.field}
                field={col.field}
                header={col.header}
              />
            );
          })}
          <Column header="Opções" body={columnBodyOptions.options} />
        </DataTable>
        <Paginator
          first={first}
          rows={10}
          totalRecords={totalElements}
          onPageChange={onPageChange}
        />
        {showCreateDialog && (
          <UserCreateDialog
            visible={showCreateDialog}
            onCreate={onCreateUser}
            onHide={closeCreateDialog}
            profiles={profiles}
          />
        )}
        {currUser && (
          <UserUpdateDialog
            data={currUser}
            visible={showDialog}
            onHide={closeDialog}
            onUpdate={onUpdateUser}
            profiles={allProfiles}
          />
        )}
        {currDeleteUser && (
          <UserDeleteDialog
            visible={showDeleteDialog}
            data={currDeleteUser}
            onDelete={onDeleteUser}
            onHide={closeDeleteDialog}
          />
        )}
      </section>
    </>
  );

  function optionsBodyTemplate(elements: Options[], users: User) {
    return (
      <div className="flex gap-2">
        {elements.map((el, index) => {
          return (
            <Button
              key={index}
              icon={el.icon}
              label={el.label}
              aria-label={el.ariaLabel}
              tooltip={el.tooltip}
              tooltipOptions={{ position: "top", className: "text-xs" }}
              size="small"
              severity="danger"
              onClick={() => el.onclick(users)}
            />
          );
        })}
      </div>
    );
  }
}

export default UserList;
