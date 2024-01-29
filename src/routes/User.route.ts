import { Router } from "express";
import multer from "multer";
import { UserController } from "../controllers";
import { checkMailMiddleware, userAuth } from "./checkEmailMiddleware";
const storage = multer.memoryStorage();
const upload = multer({ storage });
export const UserRouter = (router: Router) => {
  router.post(
    "/user/signup",
    userAuth,
    checkMailMiddleware,
    UserController.signupAccount
  );
  router.get(
    "/users/:email",
    checkMailMiddleware,
    UserController.getUserFromEmail
  );
  router.post("/user/login", checkMailMiddleware, UserController.signInAccount);
  router.put(
    "/user",
    userAuth,
    checkMailMiddleware,
    upload.single("avatar"),
    UserController.updateUser
  );
  router.post("/users/:id/follow", userAuth, UserController.followUser);
  router.delete("/users/:id/follow", userAuth, UserController.unFollowUser);
};
