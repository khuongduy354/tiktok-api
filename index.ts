import express from "express";
import multer from "multer";
import { auth } from "express-openid-connect";
import authConfig from "./src/config/0auth";
import "dotenv/config";
import router from "./src/routes";

//Middlewares
const app = express();
app.use(express.json());
app.use(auth(authConfig));
app.use(express.urlencoded({ extended: true }));
app.use("/tiktok/v1", router);

//Test endpoints
const upload = multer({ dest: "public/videos" });
app.post("/upload", upload.single("video"), (req, res) => {
  console.log(req.file);
  res.send("worked");
});

app.get("/isLoggedIn", async (req, res) => {
  const userInfo = req.oidc.user;
  console.log(userInfo);
  res.send(req.oidc.isAuthenticated() ? "Logged in" : "Logged out");
});
app.get("/helloworld", async (req, res) => {
  res.send("Hello");
});

app.listen(process.env.PORT, () => {
  console.log(`Running on ${process.env.PORT}`);
});
