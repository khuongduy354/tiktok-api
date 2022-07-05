import {
  addVideoProp,
  commentVideoProp,
  getVideoProp,
  likeVideoProp,
} from "./../types/VideoTypes";
import { Request, Response } from "express";
import { VideoDAO } from "../repositories/";
import { cloudinary } from "../config/cloudinary";
const createVideo = async (req: Request, res: Response) => {
  try {
    const VideoDTO: addVideoProp = req.body;
    const { email, title } = req.body;
    VideoDTO.author_email = JSON.parse(email);
    VideoDTO.title = JSON.parse(title);

    const bufferFile = req.file?.buffer;
    // const type = req.file?.mimetype.includes("video") ? "video" : "image";
    if (bufferFile) {
      cloudinary.uploader
        .upload_stream(async (err, result) => {
          if (err) {
            console.log(err);
            return res
              .status(500)
              .json({ error: "cannot create video", message: "unsuccess" });
          }
          if (result) {
            VideoDTO.video_location = result.url;
            await VideoDAO.addVideo(VideoDTO);
            return res.status(200).json({ message: " video created  " });
          }
        })
        .end(bufferFile);
    } else {
      console.log("no buffer");
      return res
        .status(500)
        .json({ error: "cannot create video", message: "unsuccess" });
    }
  } catch (e) {
    console.log(e);
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
    const isDeleted = await VideoDAO.deleteVideo({ user_id, video_id });
    if (isDeleted) {
      res.status(200).json({ message: `video deleted ` });
    } else {
      throw Error;
    }
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
    console.log("hit");
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
