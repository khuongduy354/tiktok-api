import { VideoController } from "../controllers";
import multer from "multer";
import { Router } from "express";
const storage = multer.memoryStorage();
const upload = multer({ storage });
export const VideoRouter = (router: Router) => {
  router.post(
    "/video",
    upload.single("videoFile"),
    VideoController.createVideo
  );
  router.get("/video/:id", VideoController.getVideo);
  router.post("/video/like", VideoController.likeVideo);
  router.post("/video/comment", VideoController.commentVideo);
  router.delete("/video", VideoController.deleteVideo);
  router.get("/video/feed/all", VideoController.allFeed);
  // router.get("/video/feed/for-you", VideoController.forYouFeed);
};
