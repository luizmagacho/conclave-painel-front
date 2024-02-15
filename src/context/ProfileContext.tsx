import {
  deleteProfile,
  getProfiles,
  getRoles,
  postProfile,
  updateProfile,
} from "@/services/profile";
import { Profile, ProfileDTO, Role } from "@/services/profile/type";
import { useRouter } from "next/router";
import { ReactNode, createContext, useEffect, useState } from "react";

interface ProviderProps {
  children: ReactNode;
}

interface ProfileContextProps {
  profiles: Profile[];
  roles: Role[];
  loading: boolean;
  totalElements: number;
  handleGetProfiles: (
    page?: number,
    name?: string,
    type?: string
  ) => Promise<void>;
  handlePostProfile: (profile: ProfileDTO) => Promise<void>;
  handleUpdateProfile: (profile: Profile) => Promise<void>;
  handleDeleteProfile: (profileId: string) => Promise<void>;
}

export const ProfileContext = createContext({} as ProfileContextProps);

export const ProfileProvider = ({ children }: ProviderProps) => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [bufferedProfiles, setBufferedProfiles] = useState<Profile[]>([]);

  const [loading, setLoading] = useState<boolean>(false);

  const [totalElements, setTotalElements] = useState<number>(0);

  const router = useRouter();

  async function handleGetProfiles(
    page: number = 0,
    name: string = "",
    type = "Nome"
  ) {
    setLoading(true);

    try {
      const { content, totalElements } = await getProfiles({
        page,
        size: 10,
        name,
        type,
      });
      setBufferedProfiles(content || []);
      setProfiles(content || []);
      setTotalElements(totalElements);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleGetRoles() {
    setLoading(true);
    try {
      setRoles(await getRoles());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handlePostProfile(profile: ProfileDTO) {
    setLoading(true);

    try {
      const resp = await postProfile(profile);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateProfile(profile: Profile) {
    setLoading(true);

    try {
      const resp = await updateProfile(profile);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteProfile(profileId: string) {
    setLoading(true);

    try {
      const resp = await deleteProfile(profileId);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    handleGetProfiles();
  }, []);

  return (
    <ProfileContext.Provider
      value={{
        profiles,
        roles,
        loading,
        totalElements,
        handleGetProfiles,
        handlePostProfile,
        handleUpdateProfile,
        handleDeleteProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
