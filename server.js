const express = require('express');
const bp = require('body-parser');
const routes = require('./controller/router.js')

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.static('view'));

app.use(bp.urlencoded({
  extended: true
}));

app.use('/', routes)

app.listen(PORT, function(){
  console.log(`Listening on ${PORT}`);
})
