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
    const VideoDTO = req.body;
    for (let key in VideoDTO) {
      VideoDTO[key] = JSON.parse(JSON.stringify(VideoDTO[key]));
    }
    const bufferFile = req.file?.buffer;

    // const type = req.file?.mimetype.includes("video") ? "video" : "image";
    if (bufferFile) {
      cloudinary.uploader
        .upload_stream({ resource_type: "raw" }, async (err, result) => {
          if (err) {
            console.log(err);
            return res
              .status(err.http_code)
              .json({ error: "cannot create video", message: err.message });
          }
          if (result) {
            VideoDTO.video_link = result.url;
            VideoDTO.author_email = req.user.email;
            const data = await VideoDAO.addVideo(VideoDTO);
            return res
              .status(200)
              .json({ message: " video created", video: data });
          }
        })
        .end(bufferFile);
    } else {
      return res
        .status(400)
        .json({ error: "No video file", message: "unsuccess" });
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
const unLikeVideo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await VideoDAO.unLikeVideo({
      author_id: parseInt(req.user.id),
      video_id: parseInt(id),
    });
    res.status(200).json({ message: `Unliked video!` });
  } catch (e) {
    res.status(500).json({ error: "cannot like  video", message: "unsuccess" });
    throw e;
  }
};
const likeVideo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const isLike = await VideoDAO.likeVideo({
      author_id: parseInt(req.user.id),
      video_id: parseInt(id),
    });
    res.status(200).json({ message: `Liked video` });
  } catch (e) {
    res.status(500).json({ error: "cannot like  video", message: "unsuccess" });
    throw e;
  }
};

const commentVideo = async (req: Request, res: Response) => {
  try {
    const { content }: commentVideoProp = req.body;
    const { id } = req.params;
    await VideoDAO.commentVideo({
      user_id: parseInt(req.user.id),
      video_id: parseInt(id),
      content,
    });
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
    const { id } = req.params;
    const video = await VideoDAO.getVideo({ id: parseInt(id) });
    if (video === undefined || video === null)
      return res.status(404).json({ error: "Cannot find video to delete" });

    let videoName = video.video_link.split("/").pop();
    videoName = videoName.split(".");
    videoName = videoName.join("");

    if (videoName === undefined || videoName === null || videoName === "")
      return res.status(404).json({ error: "Cannot find video to delete" });

    const { result } = await cloudinary.uploader.destroy(videoName, {
      resource_type: "raw",
    });
    if (result === "not found")
      return res.status(404).json({ error: "Cannot find video to delete" });

    await VideoDAO.deleteVideo({
      user_id: parseInt(req.user.id),
      video_id: parseInt(id),
    });
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
  unLikeVideo,
  commentVideo,
  deleteVideo,
  allFeed,
};
