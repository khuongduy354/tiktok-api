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
import { signJWT } from "../helper/jwt";

const signupAccount = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone_number } = req.body;

    // hash
    const saltRounds = 10;
    const hashedPassword = await bcrypt
      .hash(password, saltRounds)
      .catch((e) => {
        throw "Error";
      });

    // create user
    const UserDTO: createUserProp = {
      name,
      email,
      hashedPassword,
      phone_number,
    };
    await UserDAO.createUser(UserDTO);

    // response
    const user = await UserDAO.getUserFromEmail({ email });
    const token = signJWT(user.email, user.id);

    res.status(200).json({ message: "success", token });
  } catch (e) {
    res.status(500).json({ error: "cannot create user", message: "unsuccess" });
    throw e;
  }
};
const signInAccount = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    //hash compare
    const saltRounds = 10;
    const hashedPassword = await bcrypt
      .hash(password, saltRounds)
      .catch((e) => {
        throw "Error";
      });
    const isMatch = await bcrypt.compare(password, hashedPassword);

    //response
    if (!isMatch) {
      return res.status(404).json({ error: "Not matching password" });
    }
    const user = await UserDAO.getUserFromEmail({
      email,
    });
    const tok = signJWT(user.email, user.id);

    res.status(200).json({ message: "success", user, token: tok });
  } catch (e) {
    res.status(500).json({ error: "cannot loginuser", message: "unsuccess" });
    throw e;
  }
};

const getUserFromEmail = async (req: Request, res: Response) => {
  try {
    console.log("hey");
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
    let UserDTO = req.body;
    let hasAvatar = req.file && req.file.buffer;
    for (let key in UserDTO) {
      UserDTO[key] = JSON.parse(JSON.stringify(UserDTO[key]));
    }

    if (hasAvatar) {
      //avatar update
      const bufferFile = req.file.buffer;
      cloudinary.uploader
        .upload_stream(async (err, result) => {
          if (err) {
            return res
              .status(500)
              .json({ error: "cannot create video", message: "unsuccess" });
          }
          if (result) {
            UserDTO.avatar = result.url;
            const user = await UserDAO.updateUser(UserDTO);
            return res
              .status(200)
              .json({ message: " user updated with avatar ", user });
          }
        })
        .end(bufferFile);
    } else {
      // no avatar update
      const user = await UserDAO.updateUser(UserDTO);
      return res
        .status(200)
        .json({ message: " user updated without avatar ", user });
    }
  } catch (e) {
    res.status(500).json({ error: "cannot update", message: "unsuccess" });
    throw e;
  }
};

const followUser = async (req: Request, res: Response) => {
  try {
    let { id: follower_id } = req.params;

    await UserDAO.followUser({
      user_id: parseInt(req.user.id),
      follower_id: parseInt(follower_id),
    });
    res.status(200).json({ message: `Followed user!` });
  } catch (e) {
    res.status(500).json({ error: "cannot find", message: "unsuccess" });
    throw e;
  }
};
const unFollowUser = async (req: Request, res: Response) => {
  try {
    const { id: follower_id } = req.params;
    await UserDAO.unfollowUser({
      user_id: parseInt(req.user.id),
      follower_id: parseInt(follower_id),
    });
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
