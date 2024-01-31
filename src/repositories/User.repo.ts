import {
  followUserProp,
  getUserFromEmailProp,
  updateUserProp,
} from "./../types/UserTypes";
import { Pool } from "pg";
import { createUserProp } from "../types/UserTypes";
import { VideoDAO } from ".";
import { kn } from "../config/knex";

const pool = new Pool();

const createUser = async ({
  email,
  name = "",
  hashedPassword,
  phone_number = "",
}: createUserProp) => {
  try {
    await kn("useraccount").insert({
      email,
      name,
      phone_number,
      password: hashedPassword,
    });
    // const query = `INSERT INTO useraccount (email,name,phone_number,password) values ('${email}', '${name}','${password}','${hashedPassword}');`;
    // await pool.query(query);
  } catch (e) {
    throw e;
  }
};
const getUserFromEmail = async ({ email }: getUserFromEmailProp) => {
  try {
    //   const followQuery = ` SELECT CASE WHEN useraccount.id = userfollow.user_id THEN userfollow.follower_id END AS "followers",
    //    CASE WHEN useraccount.id = userfollow.follower_id THEN userfollow.user_id END AS "followings"
    //    FROM useraccount LEFT JOIN userfollow ON useraccount.id = userfollow.user_id or useraccount.id = userfollow.follower_id
    //    LEFT JOIN video ON useraccount.id = video.author_id
    //    WHERE useraccount.email = '${email}'
    //  ;`;
    //   const followResult = await pool.query(followQuery);
    //   mergeRows(followResult.rows, "followings");
    //   mergeRows(followResult.rows, "followers");
    let result = await kn("useraccount").where({ email }).select("*").first();
    if (result === undefined) throw Error("User not found");

    let id = result.id;

    const videoResult = await VideoDAO.getFeed(id);
    result.videos = videoResult;

    return result;
  } catch (e) {
    throw e;
  }
};
const getUserWithAuth = async ({ email }: any) => {
  try {
    const result = await kn("useraccount")
      .join("video", "useraccount.id", "=", "video.author_id")
      .where({ email })
      .select("useraccount.*")
      .first();
    if (result === undefined) throw Error("User not found");

    return result;
  } catch (e) {
    throw e;
  }
};
const getUserFromId = async (id: number) => {
  try {
    const result = await kn("usersaccount")
      .where({ user_id: id })
      .select("email", "name");
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
    await kn("useraccount")
      .update({ name, age, address, avatar })
      .where({ email });
    const result = await kn("useraccount").where({ email });
    return result;
  } catch (e) {
    throw e;
  }
};
const unfollowUser = async ({ user_id, follower_id }: followUserProp) => {
  try {
    await kn("userfollow").select().where({ user_id, follower_id }).del();
  } catch (e) {
    throw e;
  }
};
const followUser = async ({ user_id, follower_id }: followUserProp) => {
  try {
    await kn("userfollow").insert({ user_id, follower_id });
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
  unfollowUser,
};
