import React, { useContext } from "react";

import { PanelMenu } from "primereact/panelmenu";
import { useRouter } from "next/router";

import { LeftPanel } from "@/components";
import Cookies from "js-cookie";
import { AuthContext } from "@/context/AuthContext";
import UserAvatar from "@/views/UserAvatar";
import useMenu from "@/hooks/useMenu";

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

  const { itemsAdmin, items, ref } = useMenu();

  if (!user) return;
  const { name } = user;

  const role = Cookies.get("portal.role");

  return (
    <div className="h-screen flex overflow-y-hidden">
      <LeftPanel>
        <div className="flex flex-column gap-3">
          <UserAvatar name={name} />
          {role === "Administrador" && (
            <PanelMenu
              ref={ref}
              model={itemsAdmin}
              className="w-full md:w-17rem column gap-2"
            />
          )}

          <PanelMenu
            ref={ref}
            model={items}
            className="w-full md:w-17rem column gap-2"
          />
        </div>
      </LeftPanel>
      <main className="flex-1">{children}</main>
    </div>
  );
}
