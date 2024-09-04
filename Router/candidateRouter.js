const express = require("express");
const router = express.Router();
const Voter = require("./../Models/votermodels");
const { webtoken } = require("./../token/jwt");
const Candidate = require("./../Models/candidatemodel");

const checkadmin = async (adminid) => {
  try {
    const isAdmin = await Voter.findById(adminid);
    if (isAdmin.role === "Admin") {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
  }
};

router.post("/", webtoken, async (req, res) => {
  if (!(await checkadmin(req.voter.id))) {
    return res.status(403).json({ message: "Only Admin can access it.." });
  }
  try {
    const data = req.body;

    const newcandidate = new Candidate(data);
    const response = await newcandidate.save();
    console.log("new candidate added");
    res.status(200).json({ response: response });
  } catch (error) {
    res.json(error);
  }
});

router.put("/:candidateid", webtoken, async (req, res) => {
  if (!(await checkadmin(req.voter.id))) {
    return res.status(403).json({ message: "Only Admin can access it.." });
  }
  try {
    const candidateid = req.params.candidateid;
    const updatecandidate = req.body;
    const response = await Candidate.findByIdAndUpdate(
      candidateid,
      updatecandidate,
      {
        new: true,
        runValidators: true,
      }
    );
    console.log("candidate updated succesfully");
    if (!response) {
      return res.status(404).json({ error: "Candidate not found" });
    }
  } catch (error) {
    res.json(error);
  }
});

router.delete("/:candidateid", webtoken, async (req, res) => {
  if (!(await checkadmin(req.voter.id))) {
    return res.status(403).json({ message: "Only Admin can access it.." });
  }
  try {
    const candidateid = req.params.candidateid;
    const response = await Candidate.findByIdAndDelete(candidateid);
    console.log("candidate deleted succesfully");

    res.status(200).json(response);
    if (!response) {
      return res.status(404).json({ message: "Candidate not found" });
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/vote/:candidateid", webtoken, async (req, res) => {
  candidateid = req.params.candidateid;
  voterid = req.voter.id;
  try {
    const candidate = await Candidate.findById(candidateid);
    if (!candidate) {
      return res.status(400).json({ error: "candidate not found" });
    }

    const voter = await Voter.findById(voterid);
    if (!voter) {
      return res.status(400).json({ error: "Voter not found" });
    }
    if (voter == "Admin") {
      return res.status(400).json({ message: "Admin are not allowed to vote" });
    }
    if (voter.isvoted) {
      return res.status(400).json({ message: "You can vote only once" });
    }
    candidate.votes.push({ voter: voterid });
    candidate.voterCount++;
    await candidate.save();
    voter.isvoted = true;
    await voter.save();

    return res.status(200).json({ message: "Voted successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/vote/count", async (req, res) => {
  try {
    const totalvotes = await Candidate.find().sort({ voterCount: "desc" });
    const showvotes = totalvotes.map((val) => {
      return {
        name: val.partyname,
        totalvotes: val.voterCount,
      };
    });
    return res.status(400).json(showvotes);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
module.exports = router;
