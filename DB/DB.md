video {
	id integer pk increments
	author int *> useraccount.id
}

useraccount {
	id integer pk increments
}

usercomment {
	id integer pk increments
	user_id int *> useraccount.id
    video_id int *> video.id
}

userheart {
	user_id int *> useraccount.id
    video_id int *> video.id
}

userfollow {
	id integer pk increments
	follower int *> useraccount.id
	user_id int *> useraccount.id
}


