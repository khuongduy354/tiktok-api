import { Router } from "express";
import { UserController } from "../controllers";
import { checkMailMiddleware } from "./checkEmailMiddleware";

export const UserRouter = (router: Router) => {
  router.post(
    "/user/signup",
    checkMailMiddleware,
    UserController.signupAccount
  );
  router.get(
    "/user/:email",
    checkMailMiddleware,
    UserController.getUserFromEmail
  );
  router.put("/user", UserController.updateUser);
  router.post("/user/follow", UserController.followUser);
};
