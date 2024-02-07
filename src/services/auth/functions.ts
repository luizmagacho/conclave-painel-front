import Cookies from "js-cookie";
import { AuthManager } from "./types";
import { useRouter } from "next/router";

const AuthManager: AuthManager = {
  logout: () => {
    Cookies.remove("portal.token");
    const router = useRouter();
    router.push("/");
  },
};

export default AuthManager;
