import express from "express";
import multer from "multer";
import "dotenv/config";
import router from "./src/routes";
import cors from "cors";

//Middlewares
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use("/tiktok/v1", router);

//Test endpoints
const upload = multer({ dest: "public/videos" });
app.post("/upload", upload.single("video"), (req, res) => {
  console.log(req.file);
  res.send("worked");
});
app.get("/helloworld", async (req, res) => {
  console.log("hit");
  res.json({ message: "Hello" });
});

app.listen(process.env.PORT, () => {
  console.log(`Running on ${process.env.PORT}`);
});

process.on("unhandledRejection", (reason: Error, promise: Promise<any>) => {
  throw reason;
});

process.on("uncaughtException", (error: Error) => {
  process.exit(1);
});
