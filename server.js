const express = require('express');
const bp = require('body-parser');
const cheerio = require("cheerio");
const request = require("request");
const mongojs = require("mongojs")
const app = express();

const databaseUrl = "NYTimes";
const collections = ["Articles"];

const db = mongojs(databaseUrl, collections);

db.on("error", function(error) {
  console.log("Database Error:", error);
});

const PORT = process.env.PORT || 3000;

app.use(express.static('view'));

app.get('/', function(req, res){
  res.sendFile('/index.html')
})

app.get('/scrape', function(req, res){
  request("https://www.nytimes.com", function(error, response, html){
    let $ = cheerio.load(html);
    let results = [];
    $(".story-heading").each(function(i, element){
      let article = {};
      article.headline = $(element).children().text();
      article.link = $(element).children().attr("href");
      article.summary = $(element).parent().children(".summary").text();
      results.push(article);
    })
    db.Articles.insert(results);
    console.log(results);
    res.send(results);
  })
})

app.listen(PORT, function(){
  console.log(`Listening on ${PORT}`);
})
