import { NextFunction, Request, Response } from "express";

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

export const userAuth = (req: Request, res: Response, next: NextFunction) => {};
