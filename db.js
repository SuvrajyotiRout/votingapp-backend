const mongoose = require("mongoose");
require("dotenv").config();
const url = process.env.mongourl;

mongoose.connect(url);
const db = mongoose.connection;

db.on("connected", (req, res) => {
  console.log("server is connected with mongodb");
});
db.on("disconnected", (req, res) => {
  console.log("server is connected with mongodb");
});

module.exports = db;
