const User = require('../models/UserAuthorization');

/**
 * @param {*} dataObj
 * @returns user object
 * @desc map the twitter auth user object to DB user object
 */
exports.twitterUserMapper = async (dataObj) => {
  const {token, tokenSecret, profile} = dataObj;

  let user = await User.findOne({provider_uid: profile.id});
  if (!user) {
    let userObj = new User();
    userObj.provider = profile.provider;
    userObj.provider_uid = profile.id;
    userObj.name = profile.displayName;
    userObj.username = profile.username;
    userObj.gender = null;
    userObj.email = null;

    userObj.bio = profile._json.description;
    userObj.website = profile._json.entities.url.urls[0].url;
    userObj.location = profile._json.location;
    userObj.profile_image_url = profile._json.profile_image_url_https;
    userObj.banner_image_url = profile._json.profile_banner_url;

    userObj.posts_count = profile._json.statuses_count;
    userObj.followers_count = profile._json.friends_count;
    userObj.following_count = profile._json.followers_count;

    userObj.oauth_token = token;
    userObj.oauth_token_expiry = null;
    userObj.oauth_token_secret = tokenSecret;
    userObj.meta = profile._raw;

    user = await userObj.save();
  }

  return user;
};
