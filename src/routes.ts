import express, { Application } from "express";
const router = express.Router();

//Authentication
router.get("/login", (req, res) => {
  res.oidc.login({ returnTo: "/tiktok/api/callback" });
});
router.get("/callback", (req, res) => {
  const user = req.oidc.user;
  //save to db
  res.send("/");
});
export default router;
