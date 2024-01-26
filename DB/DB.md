
Video {
	id integer pk increments
	author int *> User.id
	comment int >* Comment.id
	liked int *>* User.id
}

User {
	id integer pk increments
	followers int *>* User.id
	followees int *>* User.id
	uploaded_videos int >* Video.id
	liked_videos int *>* Video.id
}

Comment {
	id integer pk increments
	reply int null >* Comment.id
}

