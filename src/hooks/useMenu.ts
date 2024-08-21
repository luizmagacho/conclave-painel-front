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
          icon: "pi pi-money-bill",
          command: () => router.push("/perfil"),
        },
        {
          label: "Contas",
          icon: "pi pi-wallet",
          command: () => router.push("/contas"),
        },
        {
          label: "Pagamentos",
          icon: "pi pi-money-bill",
          command: () => router.push("/pagamentos"),
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
    {
      label: "Ferramentas",
      icon: "pi pi-fw pi-wrench",
      command: () => {
        router.push("/ferramentas");
      },
    },
    {
      label: "Compras",
      icon: "pi pi-fw pi-shopping-cart",
      command: () => {
        router.push("/compras");
      },
    },
    {
      label: "Notas",
      icon: "pi pi-fw pi-wallet",
      command: () => {
        router.push("/custos");
      },
    },
    {
      label: "Contas a Pagar",
      icon: "pi pi-fw pi-money-bill",
      command: () => {
        router.push("/custos/contas-a-pagar");
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
