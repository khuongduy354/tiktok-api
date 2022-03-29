import { mergeMultipleRows } from "./../helper/mergeMultipleRows";
import { mergeRows } from "./../helper/mergeRows";
import { Pool } from "pg";
import {
  addVideoProp,
  commentVideoProp,
  deleteVideoProp,
  getVideoProp,
  likeVideoProp,
} from "./../types/VideoTypes";
const addVideo = async ({
  author_id,
  title = "",
  video_location,
  _public = true,
}: addVideoProp) => {
  try {
    const created_at = new Date().toISOString().slice(0, 10);
    const pool = new Pool();

    const query = `INSERT INTO video  
  (author_id,title,public,views,video_link,published_at) values(
      '${author_id}',
      '${title}',
      '${_public}',
      ${0},
      '${video_location}',
      '${created_at}'
  ) `;
    await pool.query(query);
  } catch (e) {
    throw e;
  }
};

const likeVideo = async ({ author_id, video_id }: likeVideoProp) => {
  try {
    const pool = new Pool();

    const videoQuery = `SELECT userheart.user_id as likes FROM video LEFT JOIN userheart on userheart.video_id = video.id`;
    let likesTables = await pool.query(videoQuery);
    if (likesTables.rows.some((el) => el.likes === author_id)) {
      const query = `DELETE FROM userheart WHERE user_id ='${author_id}'`;
      await pool.query(query);
      return false;
    } else {
      const query = `INSERT INTO userheart (user_id,video_id) VALUES ('${author_id}','${video_id}')`;
      await pool.query(query);
      return true;
    }
  } catch (e) {
    throw e;
  }
};
const commentVideo = async ({
  user_id,
  video_id,
  content,
}: commentVideoProp) => {
  try {
    const pool = new Pool();
    const created_at = new Date().toISOString().slice(0, 10);
    const query = `INSERT INTO usercomment (user_id, video_id,content,created_at) VALUES  ('${user_id}','${video_id}','${content}','${created_at}') `;
    await pool.query(query);
  } catch (e) {
    throw e;
  }
};

const getVideo = async ({ id }: getVideoProp) => {
  try {
    const pool = new Pool();
    const commentJoin = `usercomment on video.ID = usercomment.video_id `;
    const likesJoin = `userheart on video.ID = userheart.video_id `;
    const target = `video.*, userheart.user_id as likes, usercomment.user_id as commenter_id,
    usercomment.content as comment_content,usercomment.created_at`;
    const query = `SELECT ${target} FROM video LEFT JOIN ${likesJoin} 
     LEFT JOIN ${commentJoin}  where video.id = '${id}'`;
    let result = await pool.query(query);

    const likes = mergeRows(result.rows, "likes")[0].likes;
    const comments = mergeMultipleRows(result.rows, [
      "commenter_id",
      "comment_content",
      "created_at",
    ]);
    delete result.rows[0].commenter_id;
    delete result.rows[0].comment_content;
    delete result.rows[0].created_at;
    result.rows[0].comments = comments;
    result.rows[0].likes = likes;
    return result;
  } catch (e) {
    throw e;
  }
};

const deleteVideo = async ({ video_id, user_id }: deleteVideoProp) => {
  try {
    const pool = new Pool();
    const videoQuery = `SELECT * FROM video where ID = ${video_id}`;
    const video = await pool.query(videoQuery);
    if (video.rows[0].author_id !== user_id) {
      throw Error("Access denied");
    }
    const deleteHeart = `DELETE  FROM userheart where video_id  = ${video_id}`;
    const deleteComment = `DELETE  FROM usercomment where video_id = ${video_id}`;
    const deleteVideo = `DELETE  FROM video where ID = ${video_id}`;
    await pool.query(deleteHeart);
    await pool.query(deleteComment);
    await pool.query(deleteVideo);
  } catch (e) {
    throw e;
  }
};
const getFeed = async () => {
  try {
    const pool = new Pool();
    const commentJoin = `usercomment on video.ID = usercomment.video_id `;
    const likesJoin = `userheart on video.ID = userheart.video_id `;
    const target = `video.*, userheart.user_id as likes, usercomment.user_id as commenter_id,
    usercomment.content as comment_content,usercomment.created_at`;
    const query = `SELECT ${target} FROM video LEFT JOIN ${likesJoin} 
     LEFT JOIN ${commentJoin} `;
    const result = await pool.query(query);
    const likes = mergeRows(result.rows, "likes")[0].likes;
    const comments = mergeMultipleRows(result.rows, [
      "commenter_id",
      "comment_content",
      "created_at",
    ]);
    delete result.rows[0].commenter_id;
    delete result.rows[0].comment_content;
    delete result.rows[0].created_at;
    result.rows[0].comments = comments;
    result.rows[0].likes = likes;
    return result.rows[0];
  } catch (e) {
    throw e;
  }
};
export default {
  getFeed,
  addVideo,
  getVideo,
  commentVideo,
  likeVideo,
  deleteVideo,
};
