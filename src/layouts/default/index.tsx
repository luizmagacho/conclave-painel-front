import React, { useContext, useRef } from "react";

import { PanelMenu } from "primereact/panelmenu";
import { useRouter } from "next/router";

import { LeftPanel } from "@/components";
import Cookies from "js-cookie";
import { AuthContext } from "@/context/AuthContext";
import UserAvatar from "@/views/UserAvatar";
import useMenu from "@/hooks/useMenu";
import { Menu } from "primereact/menu";
import { Toast } from "primereact/toast";

/**
 * Layout component for the application.
 *
 * @param {Object} props - The props for the layout.
 * @param {React.ReactNode} props.children - The content to render inside the layout.
 */

type LayoutProps = {
  children?: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const toast = useRef<Toast>(null);

  const { itemsAdmin, items, ref } = useMenu();
  const role = Cookies.get("portal.role");
  if (!user) return;
  const { name } = user;

  return (
    <div className="h-screen flex overflow-y-hidden">
      <LeftPanel>
        <div className="flex flex-column gap-3 mt-6">
          <UserAvatar name={name} />
          {role === "Administrador" && (
            <PanelMenu
              ref={ref}
              model={itemsAdmin}
              className="w-full md:w-17rem column gap-2"
            />
          )}
          <Toast ref={toast} />
          <Menu model={items} className="w-full md:w-17rem column gap-2" />
        </div>
      </LeftPanel>
      <main className="flex-1">{children}</main>
    </div>
  );
}
