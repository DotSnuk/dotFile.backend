const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    // const rows = await db.getUserById(id)
    // const user = rows[0]
  } catch (err) {
    done(err);
  }
});

module.exports = passport => {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        // const rows = await db.getUser(username)
      } catch (err) {
        return done(err);
      }
    }),
  );
};
