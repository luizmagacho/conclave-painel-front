export type Profile = {
  id: string;
  name: string;
  permissions: Role[];
  enabled?: boolean | undefined;
  createdAt?: string | undefined;
  updatedAt?: string | undefined;
};

export type Role = {
  name: string;
  role: string;
};

export type ProfilePaginationParam = {
  size: number;
  page: number;
  name?: string;
  type?: string;
};

export type ProfileDTO = {
  id: string;
  name: string;
  roles: Role[];
};
