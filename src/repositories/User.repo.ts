import { Pool } from "pg";
import { createUserProp } from "../types/UserTypes";
export const createUser = async ({ email, name }: createUserProp) => {
  try {
    const pool = new Pool();
    const query = `INSERT INTO useraccount (email,name) values ('${email}', '${name}');`;
    console.log(query);
    await pool.query(query);
  } catch (e) {
    throw e;
  }
};
