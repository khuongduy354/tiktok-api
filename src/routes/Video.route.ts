import { VideoController } from "../controllers";
import { requiresAuth } from "express-openid-connect";
import multer from "multer";
import { Router } from "express";

export const VideoRouter = (router: Router) => {
  const upload = multer({ dest: "public/videos" });
  router.post(
    "/video",
    true ? requiresAuth() : () => {},
    upload.single("video"),
    VideoController.createVideo
  );
  router.get("/video/:id", VideoController.getVideo);
  router.post("/video/like", VideoController.likeVideo);
  // router.post("/video/comment", requiresAuth(), VideoController.commentVideo);import { Router } from "express";
};
