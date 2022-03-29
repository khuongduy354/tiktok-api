import {
  addVideoProp,
  commentVideoProp,
  getVideoProp,
  likeVideoProp,
} from "./../types/VideoTypes";
import { Request, Response } from "express";
import { UserDAO, VideoDAO } from "../repositories/";
import { cloudinary } from "../config/cloudinary";
import fs from "fs";
const createVideo = async (req: Request, res: Response) => {
  try {
    const VideoDTO: addVideoProp = req.body;
    const { email, title } = req.body;
    VideoDTO.author_email = JSON.parse(email);
    VideoDTO.title = JSON.parse(title);

    const file_name = req.file?.filename;
    const path = "./public/videos/" + file_name;
    cloudinary.uploader.upload(
      path,
      {
        resource_type: "video",
      },
      (err, result) => {
        if (err) throw Error("Cant connect to Cloudinary");
        if (result) {
          VideoDTO.video_location = result.secure_url;
          if (fs.existsSync(path)) fs.unlinkSync(path);
          //pass DTO to create video
          VideoDAO.addVideo(VideoDTO);
          res.status(200).json({ message: " video created  " });
        }
      }
    );
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
