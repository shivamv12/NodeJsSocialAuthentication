const express = require('express');
require('dotenv').config({path: '.env'});

const app = express();
app.set('view engine', 'ejs');

app.get('/', (req, res) => res.render('index'));

app.listen(process.env.PORT, () => {
  console.log(`\nServer is listening on Port ${process.env.PORT}`);
});
