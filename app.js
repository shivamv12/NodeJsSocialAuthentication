const cors = require('cors');
const express = require('express');
require('dotenv').config({path: '.env'});

const passport = require('passport');

const app = express();
app.set('view engine', 'ejs');

app.use(cors());
app.use(express.static('public'));

const session = require('express-session');
app.use(
  session({
    secret: process.env.APP_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use('/', require('./routes/baseRoute'));
app.use('/users', require('./routes/socialAuthRoute'));

app.listen(process.env.PORT, () => {
  console.log(`\nServer is listening on Port ${process.env.PORT}`);
});
