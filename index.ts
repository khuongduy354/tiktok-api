import express from "express";
import "dotenv/config";
import router from "./src/routes";
import cors from "cors";

//Middlewares
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use("/v1", router);

const PORT = process.env.PORT || 3000;

//Test endpoints

app.get("/helloworld", async (req, res) => {
  console.log("hit");
  res.json({ message: "Hello" });
});

app.listen(PORT, () => {
  console.log(`Running on ${PORT}`);
});

process.on("unhandledRejection", (reason: Error, promise: Promise<any>) => {
  throw reason;
});

process.on("uncaughtException", (error: Error) => {
  console.log(error);
  // process.exit(1);
});

export default app;
