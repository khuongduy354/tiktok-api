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
    const created_at = new Date().toISOString().slice(0, 10);
    const pool = new Pool();

    const query = ``;
    await pool.query(query);
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
    const userJoin = `useraccount on useraccount.id = userheart.user_id AND usercomment.user_id = useraccount.id `;
    const target = `video.*,userheart.user_id as likes,usercomment.content as comments`;
    const query = `SELECT ${target} FROM video LEFT JOIN ${likesJoin} LEFT JOIN ${commentJoin} LEFT JOIN ${userJoin} where video.id = '${id}'`;
    let result = await pool.query(query);
    result.rows = mergeRows(result.rows, "likes");
    result.rows = mergeRows(result.rows, "comments");

    return result;
  } catch (e) {
    throw e;
  }
};
export default { addVideo, getVideo, commentVideo, likeVideo };
