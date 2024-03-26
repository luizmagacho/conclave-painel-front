import { AccountProvider } from "@/context/AccountContext";
import { AuthProvider } from "@/context/AuthContext";
import { DefaultLayout } from "@/layouts";
import AccountList from "@/views/account/AccountList";

export default function Account(): JSX.Element {
  return (
    <DefaultLayout>
      <AuthProvider>
        <AccountProvider>
          <AccountList />
        </AccountProvider>
      </AuthProvider>
    </DefaultLayout>
  );
}
