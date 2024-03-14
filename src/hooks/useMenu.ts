import { useRouter } from "next/router";
import { MenuItem } from "primereact/menuitem";
import { PanelMenu } from "primereact/panelmenu";
import { useEffect, useRef, useState } from "react";
import ConstructionIcon from "@mui/icons-material/ConstructionOutlined"; // Ícone do Material Design

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
          icon: "pi pi-money-bill",
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
      label: "Material",
      icon: "pi pi-fw pi-box",
      command: () => router.push("/material"),
    },
    {
      label: "Obras",
      icon: "pi pi-fw pi-book",
      command: () => router.push("/obras"),
    },
    {
      label: "Fornecedor",
      icon: "pi pi-fw pi-truck",
      command: () => {
        router.push("/fornecedores");
      },
    },

    {
      label: "Pedido",
      icon: "pi pi-fw pi-shopping-cart",
      command: () => {
        router.push("/pedidos");
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
