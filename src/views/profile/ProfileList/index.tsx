import InputSearch from "@/components/InputSearch";
import { ProfileContext } from "@/context/ProfileContext";
import { Profile, ProfileDTO } from "@/services/profile/type";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
import { useContext, useEffect, useState } from "react";
import ProfileCreateDialog from "../ProfileCreateDialog";
import ProfileDeleteDialog from "../ProfileDeleteDialog";
import ProfileUpdateDialog from "../ProfileUpdateDialog";

interface Options {
  icon?: string;
  ariaLabel: string;
  tooltip?: string;
  label?: string;
  onclick: (profile: Profile) => void;
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
    field: "roles.role",
    header: "Papéis",
  },
];

function ProfileList() {
  const [currProfile, setCurrProfile] = useState<Profile | null>(null);
  const [currDeleteProfile, setCurrDeleteProfile] = useState<Profile | null>(
    null
  );
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [showDialogDelete, setShowDialogDelete] = useState<boolean>(false);
  const [nameSearch, setNameSearch] = useState<string>("");
  const [optionType, setOptionType] = useState<OptionType>({
    type: "Nome",
  });
  const [showCreateDialog, setShowCreateDialog] = useState<boolean>(false);
  const {
    profiles,
    roles,
    loading,
    totalElements,
    handleGetProfiles,
    handlePostProfile,
    handleUpdateProfile,
    handleDeleteProfile,
    handleGetRoles,
  } = useContext(ProfileContext);

  const [first, setFirst] = useState<number>(0);

  useEffect(() => {
    handleGetProfiles();
    handleGetRoles();
  }, []);

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
    options: (profiles: Profile) => optionsBodyTemplate(options, profiles),
  };

  async function onUpdateProfile(profile: Profile) {
    await handleUpdateProfile(profile);
    handleGetProfiles();
  }

  function openDialog(profile: Profile) {
    setCurrProfile(profile);
    setShowDialog(true);
  }

  function closeDialog() {
    setShowDialog((showDialog) => !showDialog);
    setCurrProfile(null);
  }

  function onPageChange(event: PaginatorPageChangeEvent) {
    const { page, first } = event;
    handleGetProfiles(page);
    setFirst(first);
  }

  function onSearch(name: string) {
    handleGetProfiles(0, name, optionType.type);
  }

  function onChangeSearch(name: string) {
    setNameSearch(name);
  }

  async function onCreateProfile(profile: ProfileDTO) {
    await handlePostProfile(profile);
    handleGetProfiles();
  }

  function openCreateDialog() {
    setShowCreateDialog(true);
  }

  function closeCreateDialog() {
    setShowCreateDialog((showCreateDialog) => !showCreateDialog);
  }

  async function onDeleteProfile(profileId: string) {
    await handleDeleteProfile(profileId);
    handleGetProfiles();
  }

  function openDeleteDialog(profile: Profile) {
    console.log("Teste");
    setCurrDeleteProfile(profile);
    setShowDialogDelete(true);
  }

  function closeDeleteDialog() {
    setCurrDeleteProfile(null);
    setShowDialogDelete((showDeleteDialog) => !showDeleteDialog);
  }

  return (
    <>
      <section className="flex flex-column gap-4 p-5 w-full">
        <div className="flex align-items-center justify-start w-full gap-2">
          <h1 className="m-0">Perfis</h1>
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
          emptyMessage="Nenhum perfil encontrado."
          value={profiles}
          loading={loading}
          stripedRows
          showGridlines
          rows={10}
          totalRecords={totalElements}
          tableStyle={{ minWidth: "50rem" }}
          size="small"
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
          <ProfileCreateDialog
            visible={showCreateDialog}
            onCreate={onCreateProfile}
            onHide={closeCreateDialog}
            roles={roles}
          />
        )}
        {currProfile && (
          <ProfileUpdateDialog
            data={currProfile}
            onHide={closeDialog}
            visible={showDialog}
            onUpdate={onUpdateProfile}
            roles={roles}
          />
        )}
        {currDeleteProfile && (
          <ProfileDeleteDialog
            visible={showDialogDelete}
            onDelete={onDeleteProfile}
            onHide={closeDeleteDialog}
            data={currDeleteProfile}
          />
        )}
      </section>
    </>
  );
}

function optionsBodyTemplate(elements: Options[], profiles: Profile) {
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
            onClick={() => el.onclick(profiles)}
          />
        );
      })}
    </div>
  );
}

export default ProfileList;
