import express from "express";
import multer from "multer";
import { requiresAuth } from "express-openid-connect";
import { UserController, VideoController } from "./controllers";
const router = express.Router();

//User
router.get("/user/login", (req, res) => {
  res.oidc.login({ returnTo: "/tiktok/v1/user/callback" });
});
router.get("/user/callback", UserController.loginAccount);
router.get("/user/:email", UserController.getUserFromEmail);
router.put("/user", requiresAuth(), UserController.updateUser);

//Video
const upload = multer({ dest: "public/videos" });
router.post(
  "/video",
  requiresAuth(),
  upload.single("video"),
  VideoController.createVideo
);

export default router;
