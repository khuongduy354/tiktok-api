import { Router } from "express";
import { UserController } from "../controllers";
import { checkMailMiddleware } from "./checkEmailMiddleware";

export const UserRouter = (router: Router) => {
  router.post("/user/login", checkMailMiddleware, UserController.loginAccount);
  router.get("/user/:email", UserController.getUserFromEmail);
  router.put("/user", UserController.updateUser);
  router.post("/user/follow", UserController.followUser);
};
