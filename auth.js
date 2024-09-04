const passport = require("passport");
const localStatagy = require("passport-local").Strategy;
const voter = require("./Models/votermodels");
passport.use(
  new localStatagy(async (username, password, done) => {
    let user = await voter.findOne({ userid: username });
    if (!user) return done(null, false).send("user not found");
    let ispassword = voter.getpassword(password);
    if (ispassword) {
      return done(null, user);
    } else {
      return done(null, false).send("invalid password");
    }
  })
);

module.exports = passport;
