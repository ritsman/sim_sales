import express from "express";
import router from "./routes/index.js";
import cors from "cors";
import { pool } from "./mysql/mysql.js";

const app = express();

import db from "./mongodb/mongoose.js";

app.use(cors());
app.use(express.urlencoded());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use(router);

app.listen(3020, (err) => {
  if (err) {
    console.log("error in running express server");
    return;
  }
  console.log("express server is running on port 3020");
});
