import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { MenuItem } from "primereact/menuitem";
import { PanelMenu } from "primereact/panelmenu";
import { useEffect, useRef, useState } from "react";

const useMenu = () => {
  const [shouldRefresh, setShouldRefresh] = useState(false);
  const ref = useRef<PanelMenu>(null);
  const router = useRouter();

  const userType = Cookies.get("portal.role") || "";

  // Helper to determine if a route is currently active, including sub-pages, dynamic parameters and fragments
  const isActive = (path: string) => {
    const currentPath = router.pathname;
    const currentAsPath = router.asPath;
    return (
      currentPath === path ||
      currentPath.startsWith(path + "/") ||
      currentPath.startsWith(path + "[") ||
      currentAsPath === path ||
      currentAsPath.startsWith(path + "/")
    );
  };

  const itemsAdmin: MenuItem[] = [
    {
      label: "Administração",
      icon: "pi pi-folder",
      expanded: true, // Keep administration expanded by default if active
      className: isActive("/usuarios") || isActive("/perfil") || isActive("/contas") || isActive("/pagamentos") ? "active-admin-menu" : "",
      items: [
        {
          label: "Usuários",
          command: () => router.push("/usuarios"),
          icon: "pi pi-users",
          className: isActive("/usuarios") ? "active-menuitem" : "",
        },
        {
          label: "Perfis",
          icon: "pi pi-money-bill",
          command: () => router.push("/perfil"),
          className: isActive("/perfil") ? "active-menuitem" : "",
        },
        {
          label: "Contas",
          icon: "pi pi-wallet",
          command: () => router.push("/contas"),
          className: isActive("/contas") ? "active-menuitem" : "",
        },
        {
          label: "Pagamentos",
          icon: "pi pi-money-bill",
          command: () => router.push("/pagamentos"),
          className: isActive("/pagamentos") ? "active-menuitem" : "",
        },
      ],
    },
  ];

  const allItems: MenuItem[] = [
    {
      label: "Material",
      icon: "pi pi-fw pi-box",
      command: () => router.push("/material"),
      className: isActive("/material") ? "active-menuitem" : "",
    },
    {
      label: "Obras",
      icon: "pi pi-fw pi-book",
      command: () => router.push("/obras"),
      className: isActive("/obras") ? "active-menuitem" : "",
    },
    {
      label: "Fornecedor",
      icon: "pi pi-fw pi-truck",
      command: () => {
        router.push("/fornecedores");
      },
      className: isActive("/fornecedores") ? "active-menuitem" : "",
    },

    {
      label: "Pedido",
      icon: "pi pi-fw pi-shopping-cart",
      command: () => {
        router.push("/pedidos");
      },
      className: isActive("/pedidos") ? "active-menuitem" : "",
    },
    {
      label: "Ferramentas",
      icon: "pi pi-fw pi-wrench",
      command: () => {
        router.push("/ferramentas");
      },
      className: isActive("/ferramentas") ? "active-menuitem" : "",
    },
    {
      label: "Compras",
      icon: "pi pi-fw pi-shopping-cart",
      command: () => {
        router.push("/compras");
      },
      className: isActive("/compras") ? "active-menuitem" : "",
    },
    {
      label: "Notas",
      icon: "pi pi-fw pi-wallet",
      command: () => {
        router.push("/notas");
      },
      className: isActive("/notas") ? "active-menuitem" : "",
    },
    {
      label: "Contas a Pagar",
      icon: "pi pi-fw pi-money-bill",
      command: () => {
        router.push("/custos/contas-a-pagar");
      },
      className: isActive("/custos/contas-a-pagar") ? "active-menuitem" : "",
    },
  ];

  const filterMenuItems = (items: MenuItem[], userType: string): MenuItem[] => {
    console.log(userType);
    if (userType === "Assistente") {
      return items.filter((item) => item.label !== "Contas a Pagar");
    }
    return items;
  };

  const filteredItems = filterMenuItems(allItems, userType);

  useEffect(() => {
    if (shouldRefresh) {
      router.reload();
      setShouldRefresh(false);
    }
  }, [shouldRefresh]);

  return { itemsAdmin, items: filteredItems, ref };
};

export default useMenu;
