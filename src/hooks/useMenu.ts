import { useRouter } from "next/router";
import { MenuItem } from "primereact/menuitem";
import { PanelMenu } from "primereact/panelmenu";
import { useEffect, useRef, useState } from "react";

const useMenu = () => {
  const [shouldRefresh, setShouldRefresh] = useState(false);
  const ref = useRef<PanelMenu>(null);
  const router = useRouter();

  const itemsAdmin: MenuItem[] = [
    {
      label: "Administração",
      icon: "pi pi-folder",
      expanded: false,
      items: [
        {
          label: "Usuários",
          command: () => router.push("/usuarios"),
          icon: "pi pi-users",
        },
        {
          label: "Perfis",
          icon: "pi pi-id-card",
          command: () => router.push("/perfil"),
        },
        {
          label: "Financeiro",
          icon: "pi pi-id-card",
          command: () => router.push("/perfil"),
        },
      ],
    },
  ];

  const items: MenuItem[] = [
    {
      label: "Controle de Material",
      icon: "pi pi-fw pi-building",
      command: () => router.push("/material"),
    },
    {
      label: "Controle de Obras",
      icon: "pi pi-fw pi-file",
      command: () => router.push("/obras"),
    },
    {
      label: "Controle de Fornecedores",
      icon: "pi pi-fw pi-file-export",
      command: () => {
        router.push("/fornecedores");
      },
    },
  ];

  useEffect(() => {
    if (shouldRefresh) {
      router.reload();
      setShouldRefresh(false);
    }
  }, [shouldRefresh]);

  return { itemsAdmin, items, ref };
};

export default useMenu;
