/** Packages */
const axios = require('axios');
const FormData = require('form-data');

/** User Model */
const User = require('../models/UserAuthorization');

/**
 * @param {*} req
 * @desc {*} Map user data from facebook
 */
exports.fetchFacebookData = async (dataObj) => {
  let userRes;
  const client_id = process.env.FB_CLIENT_ID;
  const client_secret = process.env.FB_CLIENT_SECRET;
  const {accessToken, refreshToken, profile} = dataObj;

  // Exchanging Short Token with Long Token
  const response = await axios(
    `https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&client_id=${client_id}&client_secret=${client_secret}&fb_exchange_token=${accessToken}`
  );

  // Fetch User Details
  const userData = await axios(
    `https://graph.facebook.com/${profile.id}?fields=birthday,email,hometown,name,picture,gender&access_token=${accessToken}`
  );

  // Fetch Page Details
  const pageDetails = await axios(
    `https://graph.facebook.com/v10.0/${profile.id}/accounts?access_token=${accessToken}`
  );

  userRes = await User.findOne({provider_uid: userData.data.id});
  if (!userRes) {
    let newUser = new User();
    newUser.provider = profile.provider;
    newUser.provider_uid = userData.data.id;
    newUser.name = userData.data.name;
    newUser.email = userData.data.email ? userData.data.email : null;
    newUser.gender = userData.data.gender ? userData.data.gender : null;
    newUser.birthday = profile._json.birthday;
    newUser.profile_url = profile._json.link;
    newUser.profile_image_url =
      userData.data &&
      userData.data.picture &&
      userData.data.picture.data &&
      userData.data.picture.data.url
        ? userData.data.picture.data.url
        : null;

    newUser.followers_count =
      profile._json && profile._json.friends && profile._json.friends.summary
        ? profile._json.friends.summary.total_count
        : 0;

    newUser.oauth_token = response.data.access_token;
    newUser.meta = profile._raw;

    if (pageDetails && pageDetails.data) {
      newUser.pages = pageDetails.data.data;
      newUser.paging = pageDetails.data.paging;
    }

    userRes = await newUser.save();
  }

  return userRes;
};

/**
 * @param {*} req
 * @desc {*} Map user data from instagram
 */
exports.fetchInstagramData = async (req, res) => {
  let userRes;
  const {code} = req.query;

  const data = new FormData();
  data.append('client_id', process.env.INSTA_CLIENT_ID);
  data.append('client_secret', process.env.INSTA_CLIENT_SECRET);
  data.append('grant_type', 'authorization_code');
  data.append('redirect_uri', process.env.INSTA_REDIRECT_URI);
  data.append('code', code);

  const config = {
    method: 'post',
    url: `${process.env.INSTA_BASE_URI}oauth/access_token`,
    headers: {
      Cookie:
        'csrftoken=vqdEt1JSy4B0NRZPAR89uLFIgnAk5WJz; ig_nrcb=1; ig_did=E9553993-482C-44CC-893A-10B576F61359; mid=YEDOfQAEAAHwmCmyBEKQ_8T0-ZWz',
      ...data.getHeaders(),
    },
    data: data,
  };

  let response = await axios(config);
  if (!response)
    res.json({error: error.response.data, error_message: error.message});

  const user_id = response.data.user_id;
  const access_token = response.data.access_token;
  const client_secret = process.env.INSTA_CLIENT_SECRET;

  // Exchanging Short Token with Long Token
  const long_token = await axios(
    `${process.env.INSTA_GRAPH_URI}access_token?client_secret=${client_secret}&access_token=${access_token}&grant_type=ig_exchange_token`
  );

  // Fetch User Details
  const userData = await axios(
    `${process.env.INSTA_GRAPH_URI}${user_id}?access_token=${long_token.data.access_token}&fields=account_type,username,media_count`
  );

  if (userData && userData.data) {
    userRes = await User.findOne({provider_uid: user_id});
    if (!userRes) {
      let newUserData = new User();
      newUserData.provider = 'instagram';
      newUserData.provider_uid = user_id;
      newUserData.username = userData.data.username;
      newUserData.followers_count = userData.data.media_count;
      newUserData.oauth_token = long_token.data.access_token;
      newUserData.oauth_token_expires_in = long_token.data.expires_in;
      userRes = await newUserData.save();
    }
  }

  return userRes;
};

/**
 * @param {*} req
 * @desc {*} Map user data from google (youtube)
 */
exports.fetchYoutubeData = async (req, res) => {};

/**
 * @param {*} req
 * @desc {*} Map user data from twitter
 */
exports.fetchTwitterData = async (dataObj) => {
  const {token, tokenSecret, profile} = dataObj;

  let user = await User.findOne({provider_uid: profile.id});
  if (!user) {
    let userObj = new User();
    userObj.provider = profile.provider;
    userObj.provider_uid = profile.id;
    userObj.name = profile.displayName;
    userObj.username = profile.username;

    userObj.bio = profile._json ? profile._json.description : null;
    userObj.website =
      profile._json &&
      profile._json.entities &&
      profile._json.entities.url &&
      profile._json.entities.url.urls &&
      profile._json.entities.url.urls.length
        ? profile._json.entities.url.urls[0].url
        : null;

    userObj.location = profile._json ? profile._json.location : null;
    userObj.profile_image_url = profile._json
      ? profile._json.profile_image_url_https
      : null;
    userObj.banner_image_url = profile._json
      ? profile._json.profile_banner_url
      : null;

    userObj.posts_count = profile._json ? profile._json.statuses_count : null;
    userObj.followers_count = profile._json
      ? profile._json.friends_count
      : null;
    userObj.following_count = profile._json
      ? profile._json.followers_count
      : null;

    userObj.oauth_token = token;
    userObj.oauth_token_secret = tokenSecret;
    userObj.meta = profile._raw;

    user = await userObj.save();
  }

  return user;
};
