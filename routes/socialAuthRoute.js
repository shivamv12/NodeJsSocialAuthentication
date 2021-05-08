/** Packages */
const express = require('express');
const passport = require('passport');

/** User Model */
const User = require('../models/UserAuthorization');

/** Passport */
const twitterStrategy = require('passport-twitter').Strategy;
const facebookStrategy = require('passport-facebook').Strategy;
const instagramStrategy = require('passport-instagram').Strategy;
const googleStrategy = require('passport-google-oauth20').Strategy;

/** Initialize Router */
const router = express.Router();

/** Controller File(s) */
const {
  fetchYoutubeData,
  fetchTwitterData,
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
        'link',
        'email',
        'about',
        'gender',
        'friends',
        'birthday',
        'hometown',
        'location',
        'education',
        'age_range',
        'short_name',
        'displayName',
        'name_format',
        'picture.type(large)',
      ],
    },
    async (accessToken, refreshToken, profile, done) => {
      let user = await fetchFacebookData({accessToken, refreshToken, profile});
      return done(null, user);
    }
  )
);

router.get(
  '/auth/facebook',
  passport.authenticate('facebook', {
    scope: [
      'email',
      'user_link',
      'user_gender',
      'user_friends',
      'user_hometown',
      'user_location',
      'user_birthday',
      'user_age_range',
      'public_profile',
      'pages_show_list',
      'user_managed_groups',
    ],
  })
);
router.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook'),
  (req, res) => res.redirect('/users/profile')
);

/**
 * =========================================================
 * Passport: Instagram Strategy
 * =========================================================
 */
passport.use(
  new instagramStrategy(
    {
      clientID: process.env.INSTA_CLIENT_ID,
      clientSecret: process.env.INSTA_CLIENT_SECRET,
      callbackURL: process.env.INSTA_CALLBACK_URI,
    },
    async (accessToken, refreshToken, profile, done) => {
      let user = {...profile, accessToken, refreshToken};
      return done(null, user);
    }
  )
);

router.get(
  '/auth/instagram',
  passport.authenticate('instagram', {scope: 'user_profile,user_media'})
);

router.get('/auth/instagram/callback', async (req, res) => {
  req.user = await fetchInstagramData(req, res);
  res.render('../views/profile.ejs', {user: req.user});
});

/**
 * =========================================================
 * Passport: Google Strategy
 * =========================================================
 */
passport.use(
  new googleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URI,
    },
    async (accessToken, refreshToken, profile, done) => {
      let user = {...profile, accessToken, refreshToken};
      return done(null, user);
    }
  )
);

router.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: [
      'email',
      'openid',
      'profile',
      'https://www.googleapis.com/auth/youtube',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/youtube.readonly',
      'https://www.googleapis.com/auth/yt-analytics.readonly',
    ],
  })
);

router.get(
  '/auth/google/callback',
  passport.authenticate('google'),
  fetchYoutubeData
);

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
    async (token, tokenSecret, profile, done) => {
      let user = await fetchTwitterData({token, tokenSecret, profile});
      return done(null, user);
    }
  )
);

router.get('/auth/twitter', passport.authenticate('twitter'));

router.get(
  '/auth/twitter/callback',
  passport.authenticate('twitter'),
  (req, res) => res.redirect('/users/profile')
);

/**
 * =========================================================
 * Passport: User Serialize & De-Serialize
 * =========================================================
 */
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

/**
 * Profile URL to render user details
 */
router.get('/profile', (req, res) => {
  res.render('../views/profile.ejs', {user: req.user ? req.user : null});
});
router.get('/welcome', (req, res) => res.render('../views/welcomeEmail.ejs'));
router.get('/welcome1', (req, res) => res.render('../views/welcomeEmail1.ejs'));

module.exports = router;
