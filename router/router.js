const { Router } = require('express');
const router = Router();
const auth = require('../controller/auth');

router.post('/login', auth.login);
router.post('/register');
router.get('/test', (req, res) => {
  console.log('inside test');
  return res.send({ msg: 'hello' });
});

router.get('/', (req, res) => {
  console.log('inside /');
  res.status(200).send('successing');
});

module.exports = router;
