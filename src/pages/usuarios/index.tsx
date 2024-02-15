import { UserProvider } from "@/context/UserContext";
import { DefaultLayout } from "@/layouts";
import UserList from "@/views/user/UserList";

export default function Users(): JSX.Element {
  return (
    <DefaultLayout>
      <UserProvider>
        <UserList />
      </UserProvider>
    </DefaultLayout>
  );
}
