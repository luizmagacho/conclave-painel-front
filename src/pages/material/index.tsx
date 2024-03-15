import { AuthProvider } from "@/context/AuthContext";
import { MaterialProvider } from "@/context/MaterialContext";
import { DefaultLayout } from "@/layouts";
import MaterialList from "@/views/material/MaterialList";

export default function Material(): JSX.Element {
  return (
    <DefaultLayout>
      <AuthProvider>
        <MaterialProvider>
          <MaterialList />
        </MaterialProvider>
      </AuthProvider>
    </DefaultLayout>
  );
}
