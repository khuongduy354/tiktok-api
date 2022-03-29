import { global } from "./../../global";
import cl from "cloudinary";
const cloudinary = cl.v2;
cloudinary.config({
  cloud_name: global.CLOUDINARY_NAME,
  api_key: global.CLOUDINARY_KEY,
  api_secret: global.CLOUDINARY_SECRET,
});

export { cloudinary };
