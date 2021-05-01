const axios = require('axios');
var FormData = require('form-data');

/**
 * @param {*} req
 * @desc {*} Fetch data from facebook
 */
exports.fetchFacebookData = async (req, res) => {};

/**
 * @param {*} req
 * @desc {*} Fetch data from instagram
 */
exports.fetchInstagramData = async (req, res) => {
  const {code} = req.query;
  console.log('HURRAH', req.query);

  if (!code) res.redirect('/');
  else {
    // let formData = new FormData();
    // formData.append('client_id', process.env.INSTA_CLIENT_ID);
    // formData.append('client_secret', process.env.INSTA_CLIENT_SECRET);
    // formData.append('grant_type', 'authorization_code');
    // formData.append('redirect_uri', process.env.INSTA_REDIRECT_URI);
    // formData.append('code', code);

    // Display the values
    // for (var value of formData.values()) {
    //   console.log(value);
    // }

    console.log(`${process.env.INSTA_BASE_URI}oauth/access_token`, {
      client_id: process.env.INSTA_CLIENT_ID,
      client_secret: process.env.INSTA_CLIENT_SECRET,
      grant_type: 'authorization_code',
      redirect_uri: process.env.INSTA_REDIRECT_URI,
      code: code,
    });

    axios({
      method: 'POST',
      url: `${process.env.INSTA_BASE_URI}oauth/access_token`,
      data: {
        client_id: process.env.INSTA_CLIENT_ID,
        client_secret: process.env.INSTA_CLIENT_SECRET,
        grant_type: 'authorization_code',
        redirect_uri: process.env.INSTA_REDIRECT_URI,
        code: code,
      },
      headers: {'Content-Type': 'application/json'},
    })
      .then(function (response) {
        console.log('Response: ', response);
      })
      .catch(function (error) {
        console.log('Error', error.response.data);
      });

    res.json({msg: 'Working on API.'});
  }
};
