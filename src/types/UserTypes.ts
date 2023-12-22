export type createUserProp = {
  email: string;
  name: string;
  hashedPassword: string;
  phone_number: string;
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
export type followUserProp = {
  follower_id: number;
  user_id: number;
};
