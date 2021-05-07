const express = require('express');
const router = express.Router();

router.get('/', (req, res) =>
  res.render('../views/index.ejs', {
    errors: req.query && req.query.error ? req.query : null,
  })
);


module.exports = router;
