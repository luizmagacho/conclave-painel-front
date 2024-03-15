import { Profile, ProfileDTO } from "../profile/type";

export type UserRole = "ADMIN" | "USER";

export type User = {
  id: string;
  name: string;
  username: string;
  department: string;
  password: string;
  role: string;
  profiles: Profile[];
  profilesName: string;
  highestPriorityRole: string;
  createdAt: string;
  createdAtFormat: string;
  updatedAt: string;
};

export type UserRequestDTO = {
  name: string;
  username: string;
  department: string;
  password: string;
  profiles: Profile[];
};

export type LoginDTO = {
  username: string;
  password: string;
};

export type LoginResponseDTO = {
  id: string;
  name: string;
  username: string;
  highestPriorityRole: string;
  token: string;
};

export type UserProfile = {
  id: string;
  name: string;
  roles: UserRole[];
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
};

export type UserRequest = {
  email: string;
};

export type UserPaginationParam = {
  size: number;
  page: number;
  name?: string;
  email?: string;
};

export type UserChangePasswordRequest = {
  id: string;
  password: string;
};
