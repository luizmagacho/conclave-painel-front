import { UserProvider } from "@/context/UserContext";
import { DefaultLayout } from "@/layouts";
import UserChangePassword from "@/views/user/UserChangePassword";

export default function User(): JSX.Element {
  return (
    <DefaultLayout>
      <UserProvider>
        <UserChangePassword />
      </UserProvider>
    </DefaultLayout>
  );
}
