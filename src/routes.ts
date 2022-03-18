import express, { Application } from "express";
import { UserController } from "./controllers";
const router = express.Router();

//Authentication
router.get("/login", (req, res) => {
  res.oidc.login({ returnTo: "/tiktok/api/callback" });
});
router.get("/callback", UserController.loginAccount);

export default router;
