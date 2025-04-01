const { Router } = require('express');
const router = Router();
const auth = require('../controller/auth');
const file = require('../controller/file')

router.post('/login', auth.login);
router.get('/logout', auth.logout);
router.post('/register', auth.register);
router.get('/auth/status', auth.status);
router.post('/upload', file.singleFile)
router.get('/test', (req, res) => {
  console.log('inside test');
  return res.send({ msg: 'hello' });
});

router.get('/', (req, res) => {
  console.log('inside /');
  res.status(200).send('successing');
});

module.exports = router;
