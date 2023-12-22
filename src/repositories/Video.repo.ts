import { parseComment } from "./../helper/parseComment";
import { Pool } from "pg";
import {
  addVideoProp,
  commentVideoProp,
  deleteVideoProp,
  getVideoProp,
  likeVideoProp,
} from "./../types/VideoTypes";
import { kn } from "../config/knex";
const pool = new Pool();

const addVideo = async ({
  author_email,
  title = "",
  video_link,
  isPublic = true,
}: addVideoProp) => {
  try {
    const published_at = new Date().toISOString().slice(0, 10);

    const userResult = await kn("useraccount")
      .where({ email: author_email })
      .select("id")
      .first();
    const author_id = userResult.id;

    await kn("video").insert({
      author_id,
      title,
      public: isPublic,
      views: 0,
      video_link,
      published_at,
    });
  } catch (e) {
    throw e;
  }
};

const unLikeVideo = async ({ author_id, video_id }: likeVideoProp) => {
  try {
    await kn("userheart").where({ user_id: author_id }).del();
  } catch (e) {
    throw e;
  }
};
const likeVideo = async ({ author_id, video_id }: likeVideoProp) => {
  try {
    await kn("userheart").insert({ user_id: author_id, video_id });
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
    await kn("usercomment").insert({ user_id, video_id, content, created_at });
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
    await kn("userheart").where(video_id).del();
    await kn("usercomment").where(video_id).del();
    await kn("video").where({ id: video_id }).del();
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
