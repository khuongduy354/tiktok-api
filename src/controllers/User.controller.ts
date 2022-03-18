import { createUserProp } from "./../types/UserTypes";
import { UserDAO } from "../repositories";
import { Request, Response } from "express";

const loginAccount = async (req: Request, res: Response) => {
  try {
    const { nickname, email } = req.oidc.user as any;
    const UserDTO: createUserProp = { name: nickname, email: email };
    await UserDAO.createUser(UserDTO);
    res.status(200).json({ message: "success" });
  } catch (e) {
    res.status(500).json({ error: "cannot create user", message: "unsuccess" });
    throw e;
  }
};
export default { loginAccount };
