// import mongoose from "mongoose";

// var mongoURL =
//   "mongodb+srv://yadavkaran471:UodgikBSn4hL8ojT@cluster0.67r13yb.mongodb.net/sim-four";

// mongoose.connect(mongoURL);

// var db = mongoose.connection;

// db.on("connected", () => {
//   console.log("Mongo db is successfully connected");
// });
// db.on("error", () => {
//   console.log("Mongo db connection failed");
// });

// export default mongoose;

import mongoose from "mongoose";

mongoose.connect("mongodb://0.0.0.0:27017/sim-four");

const db = mongoose.connection;

db.on("error", console.error.bind(console, "error connecting to db"));

db.once("open", function () {
  console.log("successfully connected to the database");
});

export default db;
