const prisma = require('./prismaClient');
const { validationResult } = require('express-validator');
const passwordUtil = require('./password');
const validate = require('./validator');

function login(req, res) {
  console.log(req.body);

  return res.status(200).send({ success: true });
}

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
  async (req, res) => {
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

    return res.status(200).send({ success: true });
  },
];

module.exports = {
  login,
  register,
};
