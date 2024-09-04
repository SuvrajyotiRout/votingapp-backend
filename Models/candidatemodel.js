const mongoose = require("mongoose");
const voter = require("./votermodels");

const candidateSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  partyname: {
    type: String,
    require: true,
  },
  rollno: {
    type: String,
    require: true,
    unique: true,
  },
  age: {
    type: Number,
    require: true,
  },
  department: {
    type: String,
    require: true,
  },
  votes: [
    {
      voter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "voter",
        require: true,
      },
    },
  ],
  voterCount: {
    type: Number,
    default: 0,
  },
});

const candidate = mongoose.model("candidate", candidateSchema);
module.exports = candidate;
