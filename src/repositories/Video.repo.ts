import { mergeRows } from "./../helper/mergeRows";
import { Pool } from "pg";
import {
  addVideoProp,
  commentVideoProp,
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
    const created_at = new Date().toISOString().slice(0, 10);

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
  author_id,
  video_id,
  content,
}: commentVideoProp) => {};

const getVideo = async ({ id }: getVideoProp) => {
  try {
    const pool = new Pool();
    const commentJoin = `usercomment on video.ID = usercomment.video_id `;
    const likesJoin = `userheart on video.ID = userheart.video_id `;
    const target = `video.*,userheart.user_id as likes,usercomment.content as comments`;
    const query = `SELECT ${target} FROM video LEFT JOIN ${likesJoin} LEFT JOIN ${commentJoin}  where video.id = '${id}'`;
    let result = await pool.query(query);
    result.rows = mergeRows(result.rows, "likes");
    result.rows = mergeRows(result.rows, "comments");

    return result;
  } catch (e) {
    throw e;
  }
};
export default { addVideo, getVideo, commentVideo, likeVideo };
