import cl from "cloudinary";
const cloudinary = cl.v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});
console.log(process.env.CLOUDINARY_NAME);
console.log(process.env.CLOUDINARY_KEY);
console.log(process.env.CLOUDINARY_SECRET);

export { cloudinary };
