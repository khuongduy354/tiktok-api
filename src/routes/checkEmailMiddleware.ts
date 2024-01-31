import { NextFunction, Request, Response } from "express";
import { decodeJWT } from "../helper/jwt";

export const checkMailMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;
  if (true) {
    next();
  } else {
    res.status(404).json({ error: "invalid email" });
  }
};

export const userAuth = (req: Request, res: Response, next: NextFunction) => {
  let tok = req.header("Authorization");
  if (tok?.startsWith("Bearer ")) {
    tok = tok.substring(7);
    const decoded = decodeJWT(tok);
    if (decoded) {
      req.user = decoded;
      next();
    } else {
      return res.status(401).json({ error: "Cant verify token" });
    }
  } else {
    return res.status(401).json({ error: "Cant find token" });
  }
};
