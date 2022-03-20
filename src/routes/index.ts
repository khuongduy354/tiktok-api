import { UserRouter } from "./User.route";
import { VideoRouter } from "./Video.route";
import express from "express";

const router = express.Router();

UserRouter(router);
VideoRouter(router);

export default router;
