import express, { Application } from "express";
import { requiresAuth } from "express-openid-connect";
import { UserController } from "./controllers";
const router = express.Router();

//User
router.get("/user/login", (req, res) => {
  res.oidc.login({ returnTo: "/tiktok/v1/user/callback" });
});
router.get("/user/callback", UserController.loginAccount);
router.get("/user/:email", UserController.getUserFromEmail);
router.put("/user", requiresAuth(), UserController.updateUser);

export default router;
