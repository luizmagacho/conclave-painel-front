import { ProfileProvider } from "@/context/ProfileContext";
import { DefaultLayout } from "@/layouts";
import ProfileList from "@/views/profile/ProfileList";

export default function Profile(): JSX.Element {
  return (
    <DefaultLayout>
      <ProfileProvider>
        <ProfileList />
      </ProfileProvider>
    </DefaultLayout>
  );
}
