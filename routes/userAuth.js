const express = require('express');
const router = express.Router();

const {
  fetchInstagramData,
} = require('../controllers/UserAuthorizationController');

router.get('/auth/facebook', (req, res) =>
  res.json({msg: 'Facebook Authentication Under Development.'})
);
router.get('/auth/instagram', (req, res) =>
  res.json({msg: 'Instagram Authentication Under Development.'})
);
router.get('/auth/instagram/callback', fetchInstagramData);
router.get('/auth/google', (req, res) =>
  res.json({msg: 'Google Authentication Under Development.'})
);
router.get('/auth/twitter', (req, res) =>
  res.json({msg: 'Twitter Authentication Under Development.'})
);

module.exports = router;
