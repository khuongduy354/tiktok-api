import fs from "fs";
import {
  createUserProp,
  followUserProp,
  getUserFromEmailProp,
  updateUserProp,
} from "./../types/UserTypes";
import { UserDAO } from "../repositories";
import { Request, Response } from "express";
import { cloudinary } from "../config/cloudinary";

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
    if (req.file === undefined) {
      const UserDTO: updateUserProp = req.body;
      const user = await UserDAO.updateUser(UserDTO);

      return res.status(200).json({ message: "updated ", user: user });
    }
    const UserDTO = req.body;
    const file_name = req.file.filename;
    const path = "./public/avatar/" + file_name;
    cloudinary.uploader.upload(
      path,
      {
        resource_type: "image",
      },
      async (err, result) => {
        if (err) throw Error("Cant connect to Cloudinary");
        if (result) {
          UserDTO.avatar = result.secure_url;
          if (fs.existsSync(path)) fs.unlinkSync(path);
          //pass DTO to create video
          const user = await UserDAO.updateUser(UserDTO);
          res.status(200).json({ message: " user updated  ", user: user });
        }
      }
    );
  } catch (e) {
    res.status(500).json({ error: "cannot update", message: "unsuccess" });
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
