const express = require('express');
const router = express.Router();

const User = require('../models/UserAuthorization');

const passport = require('passport');
const twitterStrategy = require('passport-twitter').Strategy;
const facebookStrategy = require('passport-facebook').Strategy;

const {twitterUserMapper} = require('../helpers/UserMapper');

const {
  fetchFacebookData,
  fetchInstagramData,
} = require('../controllers/UserAuthorizationController');

/**
 * =========================================================
 * Passport: Twitter Strategy
 * =========================================================
 */
passport.use(
  new twitterStrategy(
    {
      consumerKey: process.env.TWITTER_CONSUMER_KEY,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
      callbackURL: process.env.TWITTER_CALLBACK_URI,
    },
    async (token, tokenSecret, profile, cb) => {
      let err = null;
      let user = await twitterUserMapper({token, tokenSecret, profile});
      if (!user) err = 'Could not authenticate';
      return cb(err, user);
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

router.get('/auth/twitter', passport.authenticate('twitter'));

router.get(
  '/auth/twitter/callback',
  passport.authenticate('twitter', {failureRedirect: '/'}),
  (req, res) => res.redirect('/users/profile')
);

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
    scope: [
      'email',
      'public_profile',
      'user_gender',
      'user_managed_groups',
      'pages_show_list',
      'user_birthday',
    ],
  })
);
router.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: `${process.env.APP_BASE_URI}/profile`,
    failureRedirect: '/',
  })
);

router.get('/auth/instagram/callback/old', fetchInstagramData);

router.get(
  '/auth/instagram/callback',
  passport.authenticate('instagram', {failureRedirect: '/'}),
  async (req, res) => {
    res.json({msg: 'Working on Insta auth API.', data: req.user});
  }
);

router.get('/auth/google/callback', (req, res) =>
  res.json({
    access_code: req.query.code,
    msg: 'Google Authentication Under Development.',
  })
);

/**
 * Profile URL to render user details
 */
router.get('/profile', (req, res) => {
  res.render('../views/profile.ejs', {user: req.user ? req.user : null});
});
router.get('/welcome', (req, res) => res.render('../views/welcomeEmail.ejs'));

module.exports = router;
