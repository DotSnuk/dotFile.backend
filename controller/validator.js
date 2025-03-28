const { body } = require('express-validator');

const ERR_NOT_EMPTY = `Can't be empty`;
const ERR_SHORT = `Too short`;
const ERR_LONG = `Too long`;
const ERR_INVALID_CHAR = `Invalid characther(s)`;
const ERR_NOT_EMAIL = `Not correct email format`;
const ERR_NOT_MATCH = `Password don't match`;

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
    .withMessage(ERR_LONG),
];

const email = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage(ERR_NOT_EMPTY)
    .isEmail()
    .withMessage(ERR_NOT_EMAIL)
    .custom(async value => {
      // call db to check if it exists
    }),
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
    if (value !== req.body.password) throw new Error(ERR_NOT_MATCH);
  }),
];

module.exports = { name, email, password, confirm };
