const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { validationResult } = require('express-validator');
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
    return res.status(200).send({ success: true });
  },
];

module.exports = {
  login,
  register,
};
