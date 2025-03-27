const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function login(req, res) {
  console.log(req.body);

  return res.status(200).send({ success: true });
}

async function register(req, res, next) {}

module.exports = {
  login,
  register,
};
