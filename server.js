const express = require('express');
const bp = require('body-parser');
const cheerio = require("cheerio");
const request = require("request");
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.static('view'));

app.get('/', function(req, res){
  res.sendFile('/index.html')
})

app.get('/scrape', function(req, res){
  request("https://www.nytimes.com", function(error, response, html){
    let $ = cheerio.load(html);
    let results = {};
    $(".story-heading").each(function(i, element){
      let headline = $(element).children().text();
      let link = $(element).children().attr("href");
      results[headline] = link;
    })
    res.send(results);
  })
})

app.listen(PORT, function(){
  console.log(`Listening on ${PORT}`);
})
