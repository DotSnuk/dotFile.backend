const express = require('express');
const app = express();
const router = require('./router/router');
const cors = require('cors');
const corsOptions = {
  origin: ['http://localhost:5173'],
};
const session = require('express-session');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const prisma = require('./controller/prismaClient');
const passport = require('passport');

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
    secret: 'catss',
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  }),
);
require('./config/passport')(passport);
app.use(passport.session());

app.use('/', router);

const PORT = 3000;
app.listen(PORT, () => console.log(`app listening in on port ${PORT}`));
