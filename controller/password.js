const bcrypt = require('bcryptjs');
const prisma = require('../controller/prismaClient');

async function generateHash(password) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
}

async function comparePassword(username, providedPassword) {
  const { hash } = await prisma.user.findFirst({
    select: {
      hash: true,
    },
    where: {
      username: { equals: username },
    },
  });
  if (await bcrypt.compare(providedPassword, hash))
    return { success: true, msg: 'it matches' };
  return { success: false, msg: 'doesnt match' };
}

module.exports = {
  generateHash,
  comparePassword,
};
