import fs from "fs";
import {
  createUserProp,
  followUserProp,
  getUserFromEmailProp,
  updateUserProp,
} from "./../types/UserTypes";
import { UserDAO } from "../repositories";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { cloudinary } from "../config/cloudinary";

const signupAccount = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone_number } = req.body;
    const saltRounds = 10;
    const hashedPassword = await bcrypt
      .hash(password, saltRounds)
      .catch((e) => {
        throw "Error";
      });
    const UserDTO: createUserProp = {
      name,
      email,
      hashedPassword,
      phone_number,
    };
    await UserDAO.createUser(UserDTO);
    res.status(200).json({ message: "success" });
  } catch (e) {
    res.status(500).json({ error: "cannot create user", message: "unsuccess" });
    throw e;
  }
};
const signInAccount = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const saltRounds = 10;
    const hashedPassword = await bcrypt
      .hash(password, saltRounds)
      .catch((e) => {
        throw "Error";
      });
    const isMatch = await bcrypt.compare(password, hashedPassword);
    if (!isMatch) {
      return res.status(404).json({ error: "Not matching password" });
    }
    const user = await UserDAO.getUserWithAuth({
      email,
    });
    res.status(200).json({ message: "success", user });
  } catch (e) {
    res.status(500).json({ error: "cannot create user", message: "unsuccess" });
    throw e;
  }
};

const getUserFromEmail = async (req: Request, res: Response) => {
  try {
    const UserDTO: getUserFromEmailProp = req.params as any;
    const user = await UserDAO.getUserFromEmail(UserDTO);
    res.status(200).json({ message: "success", user });
  } catch (e) {
    res.status(500).json({ error: "cannot find" });
    throw e;
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    if (req.file === undefined) {
      let UserDTO = req.body;
      UserDTO = Object.keys(UserDTO).map((key) => {
        JSON.parse(UserDTO[key]);
      });
      const user = await UserDAO.updateUser(UserDTO);

      return res.status(200).json({ message: "updated ", user: user });
    }

    let UserDTO = req.body;
    for (let prop in UserDTO) {
      UserDTO[prop] = JSON.parse(UserDTO[prop]);
    }

    const bufferFile = req.file?.buffer;
    if (bufferFile) {
      cloudinary.uploader
        .upload_stream(async (err, result) => {
          if (err) {
            console.log(err);
            return res
              .status(500)
              .json({ error: "cannot create video", message: "unsuccess" });
          }
          if (result) {
            UserDTO.avatar = result.url;
            const user = await UserDAO.updateUser(UserDTO);
            return res
              .status(200)
              .json({ message: " user updated  ", user: user });
          }
        })
        .end(bufferFile);
    } else {
      return res
        .status(500)
        .json({ error: "cannot update", message: "unsuccess" });
    }
  } catch (e) {
    res.status(500).json({ error: "cannot update", message: "unsuccess" });
    throw e;
  }
};
const followUser = async (req: Request, res: Response) => {
  try {
    const { user_id, follower_id }: followUserProp = req.body;
    await UserDAO.followUser({ user_id, follower_id });
    res.status(200).json({ message: `Followed user!` });
  } catch (e) {
    res.status(500).json({ error: "cannot find", message: "unsuccess" });
    throw e;
  }
};
const unFollowUser = async (req: Request, res: Response) => {
  try {
    const { user_id, follower_id }: followUserProp = req.body;
    await UserDAO.unfollowUser({ user_id, follower_id });
    res.status(200).json({ message: `Unfollowed user!` });
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
  signInAccount,
  unFollowUser,
};
