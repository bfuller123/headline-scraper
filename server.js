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

app.use(bp.urlencoded({
  extended: true
}));

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
      article.comments = [];
      results.push(article);
    })
    db.Articles.insert(results, {ordered: false});
    console.log(results);
    res.send(results);
  })
})

app.post('/add', function(req, res){
  db.Articles.find({"headline":req.body.headline}, function(err, data){
    if(err) {
      console.log(err);
    }
    else {
      let comments = data[0].comments;
      comments.push({"user": req.body.username, "comment": req.body.userComment})
      db.Articles.update({"headline": req.body.headline}, {$set: {"comments": comments}});
    }
  })
})

app.listen(PORT, function(){
  console.log(`Listening on ${PORT}`);
})
