const express = require("express");
const router = express.Router();
const Voter = require("./../Models/votermodels");
const { webtoken, generatetoken } = require("./../token/jwt");

router.post("/signup", async (req, res) => {
  try {
    const data = req.body;

    const isadminpresent = await Voter.findOne({ role: "Admin" });
    if (data.role === "Admin" && isadminpresent) {
      return res.status(400).json({ message: "A admin is already exists.." });
    }

    if (!/^\d{10}$/.test(data.userid)) {
      return res.status(400).json({ error: "UserID Must be 10 Characters" });
    }

    const isrollpresent = await Voter.findOne({ userid: data.userid });
    if (isrollpresent) {
      return res.status(400).json({ message: "The userid is already present" });
    }
    const newvoter = new Voter(data);
    const response = await newvoter.save();
    console.log("data saved");

    const payload = {
      id: response.id,
    };
    const token = generatetoken(payload);
    res.status(200).json({ response: response, token: token });
  } catch (error) {
    res.status(400).json({ err: "internal server error" });
    console.log(error);
  }
});
router.post("/login", async (req, res) => {
  try {
    const { userid, password } = req.body;
    const voter = await Voter.findOne({ userid: userid });
    if (!voter || !(await voter.getpassword(password))) {
      return res.status(401).json({ error: "Student not found" });
    }
    const payload = {
      id: voter.id,
    };
    const token = generatetoken(payload);
    res.json(token);
  } catch (error) {
    res.send(error);
  }
});
router.get("/profile", webtoken, async (req, res) => {
  try {
    const voterData = req.voter;
    const voterid = voterData.id;
    const voter = await voterData.findById(voterid);
    res.status(200).json(voter);
  } catch (err) {
    res.json(err);
  }
});

router.put("/profile/password", webtoken, async (req, res) => {
  try {
    const voterid = req.voter.id;

    const { currentpassword, newpassword } = req.body;
    const voter = await Voter.findById(voterid);
    if (!(await voter.getpassword(currentpassword))) {
      return res.status(401).json({ message: "Incorrect Password" });
    }
    voter.password = newpassword;
    await voter.save();
    res.status(200).json({ message: "Password Updated" });
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
