  getUserFromEmail,
  getUserFromId,
  createUser,
  updateUser,
  followUser,
  getUserWithAuth,
  getFeed,
  addVideo,
  getVideo,
  commentVideo,
  likeVideo,
  deleteVideo, 
 

# Refractoring original
- Auth in database query? DONE 
- pool is local, wtf   DONE
- toggle features: like, dislike,... into 2 endpoints 
- sql instance exist, authorized middleware 



# Raw SQL


  SELECT useraccount.* FROM useraccount where user.email = email

  SELECT useraccount.* FROM useraccount where user.user_id = user_id

  UPDATE useraccount  
  name = {name} 
  age = {age}
  SET 
  WHERE useraccount.user_id = id  

  INSERT INTO userfollow (follower_id,user_id) VALUES (follower_id,user_id)
  DELETE FROM userfollow WHERE follower_id = follower_id AND user_id = user_id 

    const query = `INSERT INTO video  
  (author_id,title,public,views,video_link,published_at) values(
      '${author_id}',
      '${title}',
      '${_public}',
      ${0},
      '${video_location}',
      '${created_at}' 


INSERT INTO usercomment (user_id, video_id,content,created_at) VALUES  ('${user_id}','${video_id}','${content}','${created_at}')  

`DELETE  FROM userheart where video_id  = ${video_id}`; 
    `DELETE  FROM usercomment where video_id = ${video_id}`;
    `DELETE  FROM video where ID = ${video_id}`;

