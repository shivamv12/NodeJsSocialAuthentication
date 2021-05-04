const mongoose = require('mongoose');

mongoose.connect(
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}/${process.env.DB_NAME}?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

var userAuthSchema = mongoose.Schema(
  {
    provider: {type: String},
    provider_uid: {type: String},
    name: {type: String},
    username: {type: String},
    gender: {type: String},
    email: {type: String},

    bio: {type: String},
    website: {type: String},
    location: {type: String},
    profile_image_url: {type: String},
    banner_image_url: {type: String},

    posts_count: {type: String},
    followers_count: {type: String},
    following_count: {type: String},

    oauth_token: {type: String},
    oauth_token_expiry: {type: Date},
    oauth_token_secret: {type: String},
    status: {type: String, default: 'connected'},
    meta: {type: String},

    // social_account_id: {type: Number},
    // influencer_id: {type: Number},

    deleted_at: {type: Date, default: undefined},
  },
  {timestamps: true}
);

module.exports = mongoose.model('UserAuthorization', userAuthSchema);
