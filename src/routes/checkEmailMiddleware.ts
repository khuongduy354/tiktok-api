import { NextFunction, Request, Response } from "express";

export const checkMailMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;
  const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  if (regex.test(email)) {
    next();
  } else {
    res.status(404).json({ error: "invalid email" });
  }
};
