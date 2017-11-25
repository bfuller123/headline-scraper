const express = require('express');
const bp = require('body-parser');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.static('view'));

app.get('/', function(req, res){
  res.sendFile('/index.html')
})

app.listen(PORT, function(){
  console.log(`Listening on ${PORT}`);
})
