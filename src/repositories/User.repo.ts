import {
  followUserProp,
  getUserFromEmailProp,
  updateUserProp,
} from "./../types/UserTypes";
import { Pool } from "pg";
import { createUserProp } from "../types/UserTypes";
import { mergeRows } from "../helper/mergeRows";
const createUser = async ({
  email,
  name = "",
  password,
  hashedPassword,
}: createUserProp) => {
  try {
    const pool = new Pool();
    const query = `INSERT INTO useraccount (email,name,phone_number,password) values ('${email}', '${name}','${password}','${hashedPassword}');`;
    await pool.query(query);
  } catch (e) {
    throw e;
  }
};
const getUserFromEmail = async ({ email }: getUserFromEmailProp) => {
  try {
    const pool = new Pool();
    const followQuery = ` SELECT CASE WHEN useraccount.id = userfollow.user_id THEN userfollow.follower_id END AS "followers",
     CASE WHEN useraccount.id = userfollow.follower_id THEN userfollow.user_id END AS "followings"
     FROM useraccount LEFT JOIN userfollow ON useraccount.id = userfollow.user_id or useraccount.id = userfollow.follower_id
     WHERE useraccount.email = '${email}'
   ;`;
    const followResult = await pool.query(followQuery);
    mergeRows(followResult.rows, "followings");
    mergeRows(followResult.rows, "followers");

    const query = `SELECT useraccount.*, video.id as video_id  from useraccount LEFT JOIN video ON useraccount.ID = video.author_id WHERE useraccount.email = '${email}' `;
    let result = (await pool.query(query)) as any;
    result = mergeRows(result.rows, "video_id");
    result[0].followingState = followResult.rows[0];
    return result;
  } catch (e) {
    throw e;
  }
};
const getUserWithAuth = async ({ email }: any) => {
  try {
    const pool = new Pool();
    const query = `SELECT useraccount.*, video.id as video_id  from useraccount LEFT JOIN video ON useraccount.ID = video.author_id 
    WHERE useraccount.email = '${email}'`;
    const result = (await pool.query(query)) as any;
    return result.rows[0];
  } catch (e) {
    throw e;
  }
};
const getUserFromId = async (id: number) => {
  try {
    const pool = new Pool();
    const query = ` SELECT email, name FROM useraccount WHERE useraccount.user_id = '${id}'
   ;`;
    const result = await pool.query(query);
    return result.rows[0];
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
    const userQuery = `SELECT * from useraccount where email='${email}'`;
    const result = await pool.query(userQuery);
    return result.rows[0];
  } catch (e) {
    throw e;
  }
};

const followUser = async ({ user_id, follower_id }: followUserProp) => {
  try {
    const pool = new Pool();
    const checkExistQuery = `SELECT * FROM userfollow WHERE follower_id = '${follower_id}' AND user_id = '${user_id}'`;
    const checkResult = await pool.query(checkExistQuery);
    if (checkResult.rows.length !== 0) {
      const query = `DELETE FROM userfollow WHERE follower_id = '${follower_id}' AND user_id = '${user_id}'`;
      await pool.query(query);
      return false;
    } else {
      const query = `INSERT INTO userfollow (follower_id,user_id) VALUES ('${follower_id}','${user_id}')`;
      await pool.query(query);
      return true;
    }
  } catch (e) {
    throw e;
  }
};
export default {
  getUserFromEmail,
  getUserFromId,
  createUser,
  updateUser,
  followUser,
  getUserWithAuth,
};
