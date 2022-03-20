import {
  addVideoProp,
  getVideoProp,
  likeVideoProp,
} from "./../types/VideoTypes";
import { Request, Response } from "express";
import { UserDAO, VideoDAO } from "../repositories/";

const createVideo = async (req: Request, res: Response) => {
  try {
    const VideoDTO: addVideoProp = req.body;

    //insert userID, videoName to DTO
    const { email } = req.oidc.user as any;
    const user = await UserDAO.getUserFromEmail({ email });
    VideoDTO.author_id = user.rows[0].id;
    VideoDTO.video_location = req.file?.filename as any;

    //pass DTO to create video
    await VideoDAO.addVideo(VideoDTO);

    res.status(200).json({ message: " video updated  " });
  } catch (e) {
    res
      .status(500)
      .json({ error: "cannot create video", message: "unsuccess" });
    throw e;
  }
};
const getVideo = async (req: Request, res: Response) => {
  try {
    const { id }: getVideoProp = req.params as any;
    const video = await VideoDAO.getVideo({ id });
    res.status(200).json({ message: " video found ", video });
  } catch (e) {
    res.status(500).json({ error: "cannot find video", message: "unsuccess" });
    throw e;
  }
};
const likeVideo = async (req: Request, res: Response) => {
  try {
    const { author_id, video_id }: likeVideoProp = req.body;
    const isLike = await VideoDAO.likeVideo({ author_id, video_id });
    res.status(200).json({ message: `video ${isLike ? "liked" : "disliked"}` });
  } catch (e) {
    res.status(500).json({ error: "cannot like  video", message: "unsuccess" });
    throw e;
  }
};
export default { createVideo, getVideo, likeVideo };
