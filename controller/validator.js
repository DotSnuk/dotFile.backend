const { body } = require('express-validator');
const prisma = require('./prismaClient');

const ERR_NOT_EMPTY = `Can't be empty`;
const ERR_SHORT = `Too short`;
const ERR_LONG = `Too long`;
const ERR_INVALID_CHAR = `Invalid characther(s)`;
const ERR_NOT_EMAIL = `Not correct email format`;
const ERR_NOT_MATCH = `Password don't match`;
const ERR_USER_EXIST = `User already exists`;
const ERR_EMAIL_EXIST = `Email already exists`;

const name = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage(ERR_NOT_EMPTY)
    .isAlphanumeric()
    .withMessage(ERR_INVALID_CHAR)
    .isLength({ min: 2 })
    .withMessage(ERR_SHORT)
    .isLength({ max: 15 })
    .withMessage(ERR_LONG)
    .custom(async value => {
      const user = await prisma.user.findMany({
        where: {
          username: {
            equals: value,
          },
        },
      });
      if (user.length > 0) {
        throw new Error(ERR_USER_EXIST);
      } else {
        return value;
      }
    })
    .withMessage(ERR_USER_EXIST),
];

const email = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage(ERR_NOT_EMPTY)
    .isEmail()
    .withMessage(ERR_NOT_EMAIL)
    .custom(async value => {
      const user = await prisma.user.findMany({
        where: {
          email: {
            equals: value,
          },
        },
      });
      if (user.length > 0) {
        throw new Error(ERR_EMAIL_EXIST);
      } else {
        return value;
      }
    })
    .withMessage(ERR_EMAIL_EXIST),
];

const password = [
  body('password')
    .notEmpty()
    .withMessage(ERR_NOT_EMPTY)
    .isLength({ min: 3 })
    .withMessage(ERR_SHORT),
];

const confirm = [
  body('confirm').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error(ERR_NOT_MATCH);
    } else {
      return value;
    }
  }),
];

module.exports = { name, email, password, confirm };
