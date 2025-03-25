const { Router } = require('express');
const router = Router();

router.get('/', (req, res) => {
  res.status(200).send('successing');
});

module.exports = router;
