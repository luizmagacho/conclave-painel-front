import { MaterialProvider } from "@/context/MaterialContext";
import { DefaultLayout } from "@/layouts";
import MaterialList from "@/views/material/MaterialList";

export default function Material(): JSX.Element {
  return (
    <DefaultLayout>
      <MaterialProvider>
        <MaterialList/>
      </MaterialProvider>
    </DefaultLayout>
  )
}