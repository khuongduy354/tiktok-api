import { parseComment } from "./../helper/parseComment";
import { Pool } from "pg";
import {
  addVideoProp,
  commentVideoProp,
  deleteVideoProp,
  getVideoProp,
  likeVideoProp,
} from "./../types/VideoTypes";
const pool = new Pool();

const addVideo = async ({
  author_email,
  title = "",
  video_location,
  _public = true,
}: addVideoProp) => {
  try {
    const created_at = new Date().toISOString().slice(0, 10);

    const userQuery = `SELECT id from useraccount where email = '${author_email}' `;
    const userResult = await pool.query(userQuery);
    const author_id = userResult.rows[0].id;

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

// TODO: separate like and unlike
const unLikeVideo = async ({ author_id, video_id }: likeVideoProp) => {
  try {
    const query = `DELETE FROM userheart WHERE user_id ='${author_id}'`;
    await pool.query(query);
  } catch (e) {
    throw e;
  }
};
const likeVideo = async ({ author_id, video_id }: likeVideoProp) => {
  try {
    const query = `INSERT INTO userheart (user_id,video_id) VALUES ('${author_id}','${video_id}')`;
    await pool.query(query);
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
    const created_at = new Date().toISOString().slice(0, 10);
    const query = `INSERT INTO usercomment (user_id, video_id,content,created_at) VALUES  ('${user_id}','${video_id}','${content}','${created_at}') `;
    await pool.query(query);
  } catch (e) {
    throw e;
  }
};

const getVideo = async ({ id }: getVideoProp) => {
  try {
    const commentJoin = `usercomment on video.ID = usercomment.video_id `;
    const likesJoin = `userheart on video.ID = userheart.video_id `;
    const authorJoin = `useraccount on useraccount.id = usercomment.user_id`;
    const fields = `video.*, 
      ARRAY_AGG (DISTINCT userheart.user_id) as hearts,
      ARRAY_AGG (useraccount.email || '//' || useraccount.avatar || '//' || content ) as comments`;

    const query = `SELECT ${fields} FROM video 
    LEFT JOIN ${likesJoin} LEFT JOIN ${commentJoin}  
    LEFT JOIN ${authorJoin}
    WHERE video.id = ${id}
    GROUP BY video.id `;

    const result = await pool.query(query);
    result.rows[0].comments = result.rows[0].comments.filter(
      (comment: any) => comment !== null
    );
    result.rows[0].comments = parseComment(result.rows[0].comments);
    result.rows[0].hearts = result.rows[0].hearts.filter(
      (heart: any) => heart !== null
    );

    return result;
  } catch (e) {
    throw e;
  }
};

const deleteVideo = async ({ video_id, user_id }: deleteVideoProp) => {
  try {
    const deleteHeart = `DELETE  FROM userheart where video_id  = ${video_id}`;
    const deleteComment = `DELETE  FROM usercomment where video_id = ${video_id}`;
    const deleteVideo = `DELETE  FROM video where ID = ${video_id}`;
    await pool.query(deleteHeart);
    await pool.query(deleteComment);
    await pool.query(deleteVideo);
    return true;
  } catch (e) {
    return false;
  }
};
const getFeed = async (queryId = -1) => {
  try {
    const commentJoin = `usercomment on video.ID = usercomment.video_id `;
    const likesJoin = `userheart on video.ID = userheart.video_id `;
    const target = `video.*,
    u2.email as author_email,u2.avatar as author_avatar,
      ARRAY_AGG (DISTINCT userheart.user_id) as hearts,
      ARRAY_AGG (u1.email || '$$' || u1.avatar || '$$' || content ) as comments
       `;
    const idCondition = queryId !== -1 ? `u2.id  = '${queryId}'` : "";

    const query = `SELECT ${target} FROM video 
    LEFT JOIN ${likesJoin} LEFT JOIN ${commentJoin}  
    LEFT JOIN useraccount u1 on u1.id = usercomment.user_id
    LEFT JOIN useraccount u2 on u2.id = video.author_id 
    WHERE ${idCondition}
    GROUP BY video.id,u2.id
    ORDER BY RANDOM()
    LIMIT 20 
     `;

    const result = await pool.query(query);

    for (let row of result.rows) {
      row.comments = row.comments.filter((comment: any) => comment !== null);
      row.hearts = row.hearts.filter((heart: any) => heart !== null);
      row.comments = parseComment(row.comments);
    }

    return result.rows;
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
  unLikeVideo,
  deleteVideo,
};
