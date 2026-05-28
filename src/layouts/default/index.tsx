import React, { useContext } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { LeftPanel } from "@/components";
import Cookies from "js-cookie";
import { AuthContext } from "@/context/AuthContext";
import UserAvatar from "@/views/UserAvatar";

type LayoutProps = {
  children?: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const role = Cookies.get("portal.role");

  if (!user) return null;
  const { name } = user;

  // Rigorous active check for sub-routes, dynamic parameters, and parent paths
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

  return (
    <div className="h-screen flex overflow-y-hidden">
      <LeftPanel>
        <div className="flex flex-column gap-3 mt-4 w-full" style={{ maxHeight: "calc(100vh - 180px)", overflowY: "auto", overflowX: "hidden" }}>
          <UserAvatar name={name} />

          {/* Administración Group */}
          {role === "Administrador" && (
            <div className="custom-sidebar-menu">
              <div className="custom-sidebar-section-title">Administração</div>
              <Link href="/usuarios" className={`custom-sidebar-item ${isActive("/usuarios") ? "active" : ""}`}>
                <i className="pi pi-users text-sm"></i>
                <span>Usuários</span>
              </Link>
              <Link href="/perfil" className={`custom-sidebar-item ${isActive("/perfil") ? "active" : ""}`}>
                <i className="pi pi-money-bill text-sm"></i>
                <span>Perfis</span>
              </Link>
              <Link href="/contas" className={`custom-sidebar-item ${isActive("/contas") ? "active" : ""}`}>
                <i className="pi pi-wallet text-sm"></i>
                <span>Contas</span>
              </Link>
              <Link href="/pagamentos" className={`custom-sidebar-item ${isActive("/pagamentos") ? "active" : ""}`}>
                <i className="pi pi-money-bill text-sm"></i>
                <span>Pagamentos</span>
              </Link>
            </div>
          )}

          {/* Geral Group */}
          <div className="custom-sidebar-menu mt-2">
            <div className="custom-sidebar-section-title">Geral</div>
            <Link href="/material" className={`custom-sidebar-item ${isActive("/material") ? "active" : ""}`}>
              <i className="pi pi-box text-sm"></i>
              <span>Material</span>
            </Link>
            <Link href="/obras" className={`custom-sidebar-item ${isActive("/obras") ? "active" : ""}`}>
              <i className="pi pi-book text-sm"></i>
              <span>Obras</span>
            </Link>
            <Link href="/fornecedores" className={`custom-sidebar-item ${isActive("/fornecedores") ? "active" : ""}`}>
              <i className="pi pi-truck text-sm"></i>
              <span>Fornecedor</span>
            </Link>
            <Link href="/pedidos" className={`custom-sidebar-item ${isActive("/pedidos") ? "active" : ""}`}>
              <i className="pi pi-shopping-cart text-sm"></i>
              <span>Pedido</span>
            </Link>
            <Link href="/ferramentas" className={`custom-sidebar-item ${isActive("/ferramentas") ? "active" : ""}`}>
              <i className="pi pi-wrench text-sm"></i>
              <span>Ferramentas</span>
            </Link>
            <Link href="/compras" className={`custom-sidebar-item ${isActive("/compras") ? "active" : ""}`}>
              <i className="pi pi-shopping-cart text-sm"></i>
              <span>Compras</span>
            </Link>
            <Link href="/notas" className={`custom-sidebar-item ${isActive("/notas") ? "active" : ""}`}>
              <i className="pi pi-wallet text-sm"></i>
              <span>Notas</span>
            </Link>
            {role !== "Assistente" && (
              <Link href="/custos/contas-a-pagar" className={`custom-sidebar-item ${isActive("/custos/contas-a-pagar") ? "active" : ""}`}>
                <i className="pi pi-money-bill text-sm"></i>
                <span>Contas a Pagar</span>
              </Link>
            )}
          </div>
        </div>
      </LeftPanel>
      <main className="flex-1 overflow-y-auto h-screen">{children}</main>
    </div>
  );
}
