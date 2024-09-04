const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const voterSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  userid: {
    type: Number,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  department: {
    type: String,
    require: true,
  },
  role: {
    type: String,
    enum: ["voter", "Admin"],
    default: "voter",
  },
  email: {
    type: String,
  },
  mobile: {
    type: String,
    require: true,
  },
  isvoted: {
    type: Boolean,
    default: false,
  },
});

voterSchema.pre("save", async function (next) {
  const voterdata = this;
  if (!voterdata.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(voterdata.password, salt);
    voterdata.password = hashedpassword;
    next();
  } catch (e) {
    console.log(e);
  }
});
voterSchema.methods.getpassword = async function (pass) {
  try {
    const ismatch = await bcrypt.compare(pass, this.password);
    return ismatch;
  } catch (error) {
    throw error;
  }
};
const Voter = mongoose.model("voter", voterSchema);
module.exports = Voter;
