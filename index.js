const express = require('express');
const app = express();
const router = require('./router/router');
const cors = require('cors');
const corsOptions = {
  origin: ['http://localhost:5173'],
};
const session = require('express-session');
const passport = require('passport');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'cats', resave: false, saveUninitialized: false }));

app.use('/', router);

const PORT = 3000;
app.listen(PORT, () => console.log(`app listening in on port ${PORT}`));
