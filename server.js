let express = require("express");
let app = express();
let db = require("./db");
require("dotenv").config();
const { webtoken } = require("./token/jwt");
let passport = require("./auth");
const voterRouter = require("./Router/voterRouter");
const candidateRouter = require("./Router/candidateRouter");
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(passport.initialize());

app.get("/", (req, res) => {
  res.send("you can do this project only stay focused");
});
const vari = passport.authenticate("local", { session: false });
app.use("/voto", voterRouter);
app.use("/candidate", webtoken, candidateRouter);
app.listen(3000, () => console.log("server is running on port 3000"));
