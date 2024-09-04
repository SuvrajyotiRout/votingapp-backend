const jwt = require("jsonwebtoken");

const webtoken = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) return res.status(401).json({ error: "Token Not Found" });

  let token = req.headers.authorization.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    let decoded = jwt.verify(token, process.env.secretkey);
    req.voter = decoded;
    next();
  } catch (error) {
    console.log(error);
  }
};

const generatetoken = (userdata) => {
  return jwt.sign(userdata, process.env.secretkey);
};

module.exports = { webtoken, generatetoken };
