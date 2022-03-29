import {
  createUserProp,
  followUserProp,
  getUserFromEmailProp,
  updateUserProp,
} from "./../types/UserTypes";
import { UserDAO } from "../repositories";
import { Request, Response } from "express";

const signupAccount = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;
    const UserDTO: createUserProp = { name, email };
    await UserDAO.createUser(UserDTO);
    res.status(200).json({ message: "success" });
  } catch (e) {
    res.status(500).json({ error: "cannot create user", message: "unsuccess" });
    throw e;
  }
};

const getUserFromEmail = async (req: Request, res: Response) => {
  try {
    const UserDTO: getUserFromEmailProp = req.params as any;
    const result = await UserDAO.getUserFromEmail(UserDTO);
    res.status(200).json({ message: "success", user: result[0] });
  } catch (e) {
    res.status(500).json({ error: "cannot find" });
    throw e;
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const UserDTO: updateUserProp = req.body;
    await UserDAO.updateUser(UserDTO);
    res.status(200).json({ message: "updated  " });
  } catch (e) {
    res.status(500).json({ error: "cannot find", message: "unsuccess" });
    throw e;
  }
};
const followUser = async (req: Request, res: Response) => {
  try {
    const { user_id, follower_id }: followUserProp = req.body;
    const isFollow = await UserDAO.followUser({ user_id, follower_id });
    res
      .status(200)
      .json({ message: `${isFollow ? "followed " : "unfollowed "} user ` });
  } catch (e) {
    res.status(500).json({ error: "cannot find", message: "unsuccess" });
    throw e;
  }
};
export default {
  signupAccount,
  getUserFromEmail,
  updateUser,
  followUser,
};
