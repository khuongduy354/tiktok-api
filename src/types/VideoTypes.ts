export type addVideoProp = {
  author_email: string;
  title: string;
  video_link: string;
  isPublic?: boolean;
  video_location?: string;
};
export type getVideoProp = {
  id: number;
};
export type likeVideoProp = {
  author_id: number;
  video_id: number;
};
export type commentVideoProp = {
  user_id: number;
  video_id: number;
  content: string;
};
export type deleteVideoProp = {
  video_id: number;
  user_id: number;
};
