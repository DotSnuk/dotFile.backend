const prisma = require('./prismaClient');
const { validationResult } = require('express-validator');
const passwordUtil = require('./password');
const supabase = require('./supabase');
const validate = require('./validator');
const passport = require('passport');

const login = [
  passport.authenticate('local'),
  async (req, res, next) => {
    // const {id} = req.user;
    // await supabase.rpc('set_user_id', {user_id: id})
    res.status(200).send({ success: true, user: req.user });
  },
];

const logout = [
  (req, res, next) => {
    req.logout(err => {
      if (err) {
        return next(err);
      }
      res.redirect('/');
    });
  },
];

const register = [
  validate.name,
  validate.email,
  validate.password,
  validate.confirm,
  (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      console.log('inside result isnt empty');
      console.log(result);
      return res
        .status(406)
        .send({ success: false, errors: [...result.errors] });
    }
    next();
  },
  async (req, res, next) => {
    console.log('inside success');
    const { username, password, email } = req.body;
    const hash = await passwordUtil.generateHash(password);
    await prisma.user.create({
      data: {
        username: username,
        email: email,
        hash: hash,
      },
    });
    // might be able to return the id when creating the user and pass that
    next();
  },
  async (req, res, next) => {
    const {username} = req.body
    const {id} = await prisma.user.findFirst({select: {
      id: true
    }, where: {
      username: {equals: username}
    }}, )
    await prisma.folder.create({
      data: {
        name: id.toString(),
        ownerId: id
      }
    })
    console.log('inside create folder')
    return res.status(200).send({ success: true });
  }
];

const status = [
  (req, res) => {
    if (req.isAuthenticated()) {
      return res.send({ isAuthenticated: true, user: req.user });
    }
    return res.send({ isAuthenticated: false });
  },
];

module.exports = {
  login,
  logout,
  register,
  status,
};
