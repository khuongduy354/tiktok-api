import express from "express";
import "dotenv/config";
import router from "./src/routes";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);

app.get("/helloworld", (req, res) => {
  res.send("Hello");
});

app.listen(process.env.PORT, () => {
  console.log(`Running on ${process.env.PORT}`);
});
