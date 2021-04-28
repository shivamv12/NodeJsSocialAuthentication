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
    name: {type: String},
    email: {type: String},
    gender: {type: String},
    provider: {type: String},
    providerUid: {type: String},
    oauthToken: {type: String},
    profileImageUrl: {type: String},
    status: {type: String, default: 'connected'},
    meta: {type: String},

    // socialAccountId: {type: Number},
    username: {type: String},
    // oauthTokenSecret: {type: String},
    oauthTokenExpiry: {type: Date},
    // influencerId: {type: Number},

    deletedAt: {type: Date, default: undefined},
  },
  {timestamps: true}
);

module.exports = mongoose.model('UserAuthorization', userAuthSchema);
