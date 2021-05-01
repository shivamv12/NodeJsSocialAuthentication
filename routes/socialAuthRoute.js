const express = require('express');
const router = express.Router();

const passport = require('passport');
const facebookStrategy = require('passport-facebook').Strategy;

const {
  fetchFacebookData,
  fetchInstagramData,
} = require('../controllers/UserAuthorizationController');

/**
 * =========================================================
 * Passport: Facebook Strategy
 * =========================================================
 */
passport.use(
  new facebookStrategy(
    {
      clientID: process.env.FB_CLIENT_ID,
      clientSecret: process.env.FB_CLIENT_SECRET,
      callbackURL: process.env.FB_CALLBACK_URI,
      profileFields: [
        'id',
        'name',
        'email',
        'gender',
        'birthday',
        'displayName',
        'picture.type(large)',
      ],
    },
    (token, refreshToken, profile, done) => {
      console.log(token);
      console.log(refreshToken);
      console.log(JSON.stringify(profile));
    }
  )
);

router.get(
  '/auth/facebook',
  passport.authenticate('facebook', {
    scope: 'email, public_profile, user_gender, user_birthday',
  })
);
router.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: `${process.env.APP_BASE_URI}/profile`,
    failureRedirect: '/',
  })
);

router.get('/auth/instagram/callback', fetchInstagramData);

router.get('/auth/google', (req, res) =>
  res.json({msg: 'Google Authentication Under Development.'})
);

router.get('/auth/twitter', (req, res) =>
  res.json({msg: 'Twitter Authentication Under Development.'})
);

/**
 * Profile URL to render user details
 */
router.get('/profile', (req, res) => res.render('../views/profile.ejs'));

module.exports = router;
