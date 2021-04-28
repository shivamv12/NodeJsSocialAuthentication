const express = require('express');
require('dotenv').config({path: '.env'});

const app = express();
app.set('view engine', 'ejs');

app.use('/', require('./routes/api'));
app.use('/users', require('./routes/userAuth'));

app.listen(process.env.PORT, () => {
  console.log(`\nServer is listening on Port ${process.env.PORT}`);
});
