import { Router } from "express";
import multer from "multer";
import { UserController } from "../controllers";
import { checkMailMiddleware } from "./checkEmailMiddleware";
const storage = multer.memoryStorage();
const upload = multer({ storage });
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
  router.post("/user/login", checkMailMiddleware, UserController.signInAccount);
  router.put("/user", upload.single("avatar"), UserController.updateUser);
  router.post("/user/follow", UserController.followUser);
  router.delete("/user/follow", UserController.unFollowUser);
};
