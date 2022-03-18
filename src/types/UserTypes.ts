export type createUserProp = {
  email: string;
  name: string;
};
export type getUserFromEmailProp = {
  email: string;
};
export type updateUserProp = {
  email: string;
  name?: string;
  age?: number;
  address?: string;
  phone_number?: string;
  avatar?: string;
};
