import { VideoController } from "../controllers";
import multer from "multer";
import { Router } from "express";
import { userAuth } from "./checkEmailMiddleware";
const storage = multer.memoryStorage();
const upload = multer({ storage });
export const VideoRouter = (router: Router) => {
  router.post(
    "/video",
    userAuth,
    upload.single("videoFile"),
    VideoController.createVideo
  );
  router.get("/videos/:id", VideoController.getVideo);
  router.delete("/videos/:id", userAuth, VideoController.deleteVideo);

  router.post("/videos/:id/like", userAuth, VideoController.likeVideo);
  router.delete("/videos/:id/like", userAuth, VideoController.unLikeVideo);
  router.post("/videos/:id/comment", userAuth, VideoController.commentVideo);

  router.get("/videos/feed/all", userAuth, VideoController.allFeed);
  // router.get("/video/feed/for-you", VideoController.forYouFeed);
};
