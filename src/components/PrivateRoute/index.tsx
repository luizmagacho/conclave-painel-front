import { AuthContext } from "@/context/AuthContext";
import { UserRole } from "@/services/user/type";
import { useRouter } from "next/router";
import { useState, useContext, useEffect } from "react";

interface PrivateRouteProps {
  children: React.ReactNode;
  requiredRoles: string[];
}

export default function PrivateRoute({
  children,
  requiredRoles,
}: PrivateRouteProps) {
  const [allowed, setAllowed] = useState<boolean>(false);
  const { user } = useContext(AuthContext);
  const router = useRouter();

  // useEffect(() => {
  //   if (
  //     !requiredRoles.some((role) => profile.roles.includes(role as UserRole)) ||
  //     Object.keys(user).length === 0
  //   ) {
  //     router.push("/");
  //     return;
  //   }
  //   setAllowed(true);
  // }, [router, user]);

  return allowed ? <>{children}</> : null;
}
