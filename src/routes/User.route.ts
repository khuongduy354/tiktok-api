import { Router } from "express";
import { UserController } from "../controllers";
import { requiresAuth } from "express-openid-connect";

export const UserRouter = (router: Router) => {
  router.get("/user/login", (req, res) => {
    res.oidc.login({ returnTo: "/tiktok/v1/user/callback" });
  });
  router.get("/user/callback", UserController.loginAccount);
  router.get("/user/:email", UserController.getUserFromEmail);
  router.put("/user", UserController.updateUser);
  router.post("/user/follow", UserController.followUser);
};
