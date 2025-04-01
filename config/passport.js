const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const prisma = require('../controller/prismaClient');
const passwordUtil = require('../controller/password');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: {
          equals: id,
        },
      },
    });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport => {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await prisma.user.findFirst({
          where: {
            username: {
              equals: username,
            },
          },
        });
        if (!user) return done(null, false, { message: 'Incorrect username' });
        const doesMatch = await passwordUtil.comparePassword(
          username,
          password,
        );
        if (!doesMatch.success)
          return done(null, false, { message: 'incorrect password' });
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }),
  );
};
