import { getUserFromEmailProp, updateUserProp } from "./../types/UserTypes";
import { Pool } from "pg";
import { createUserProp } from "../types/UserTypes";
const createUser = async ({ email, name }: createUserProp) => {
  try {
    const pool = new Pool();
    const query = `INSERT INTO useraccount (email,name) values ('${email}', '${name}');`;
    await pool.query(query);
  } catch (e) {
    throw e;
  }
};
const getUserFromEmail = async ({ email }: getUserFromEmailProp) => {
  try {
    const pool = new Pool();
    const query = `SELECT * FROM useraccount where email = '${email}'`;
    const result = await pool.query(query);
    return result;
  } catch (e) {
    throw e;
  }
};
const updateUser = async ({
  email,
  name = "",
  age = 0,
  address = "",
  phone_number = "",
  avatar = "",
}: updateUserProp) => {
  try {
    const pool = new Pool();
    const query = `UPDATE useraccount SET 
    name = '${name}',
    age = ${age},
    address = '${address}',
    phone_number = '${phone_number}',
    avatar = '${avatar}'
    WHERE email = '${email}'`;
    await pool.query(query);
  } catch (e) {
    throw e;
  }
};

export default { getUserFromEmail, createUser, updateUser };
