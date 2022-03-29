import {
  addVideoProp,
  commentVideoProp,
  getVideoProp,
  likeVideoProp,
} from "./../types/VideoTypes";
import { Request, Response } from "express";
import { UserDAO, VideoDAO } from "../repositories/";

const createVideo = async (req: Request, res: Response) => {
  try {
    const VideoDTO: addVideoProp = req.body;
    const { email } = req.body;
    console.log(email);
    const user = await UserDAO.getUserFromEmail({ email });
    console.log(user);
    VideoDTO.author_id = user[0].id;
    VideoDTO.video_location = req.file?.filename as any;
    //pass DTO to create video
    await VideoDAO.addVideo(VideoDTO);

    res.status(200).json({ message: " video created  " });
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
    res.status(200).json({ message: " video found ", video: video.rows[0] });
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

const commentVideo = async (req: Request, res: Response) => {
  try {
    const { user_id, video_id, content }: commentVideoProp = req.body;
    await VideoDAO.commentVideo({ user_id, video_id, content });
    res.status(200).json({ message: `video comment made` });
  } catch (e) {
    res
      .status(500)
      .json({ error: "cannot comment  video", message: "unsuccess" });
    throw e;
  }
};

const deleteVideo = async (req: Request, res: Response) => {
  try {
    const { user_id, video_id }: commentVideoProp = req.body;
    await VideoDAO.deleteVideo({ user_id, video_id });
    res.status(200).json({ message: `video deleted ` });
  } catch (e) {
    res
      .status(500)
      .json({ error: "cannot delete  video", message: "unsuccess" });
    throw e;
  }
};

const forYouFeed = async (req: Request, res: Response) => {
  try {
    const { user_id, video_id }: commentVideoProp = req.body;
    await VideoDAO.deleteVideo({ user_id, video_id });
    res.status(200).json({ message: `video deleted ` });
  } catch (e) {
    res
      .status(500)
      .json({ error: "cannot delete  video", message: "unsuccess" });
    throw e;
  }
};
const allFeed = async (req: Request, res: Response) => {
  try {
    const result = await VideoDAO.getFeed();
    res.status(200).json({ message: `feed generated`, feed: result });
  } catch (e) {
    res.status(500).json({ error: "cannot find feed", message: "unsuccess" });
    throw e;
  }
};

export default {
  createVideo,
  getVideo,
  likeVideo,
  commentVideo,
  deleteVideo,
  allFeed,
};
