export type addVideoProp = {
  author_id: number;
  title: string;
  video_location: string;
  _public?: boolean;
};
export type getVideoProp = {
  id: number;
};
export type likeVideoProp = {
  author_id: number;
  video_id: number;
};
export type commentVideoProp = {
  author_id: number;
  video_id: number;
  content: string;
};
