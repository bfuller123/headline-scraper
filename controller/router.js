const express = require('express');
const router = express.Router();
const db = require('../model/database.js');
const cheerio = require("cheerio");
const request = require("request");
const mongoose = require('mongoose');

router.get('/', function(req, res){
  res.sendFile('/index.html');
})

mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/NYTimes", {
  useMongoClient: true
});

router.get('/scrape', function(req, res){
  request("https://www.nytimes.com", function(error, response, html){
    let $ = cheerio.load(html);
    let results = [];
    $(".story-heading").each(function(i, element){
      let article = {};
      article.headline = $(element).children().text();
      article.link = $(element).children().attr("href");
      article.summary = $(element).parent().children(".summary").text();
      article.comments = [];
      db.create(article);
      results.push(article);
    })
    res.send(results);
  })
})

router.post('/add', function(req, res){
  db.find({"headline":req.body.headline}, function(err, data){
    if(err) {
      console.log(err);
    }
    else {
      console.log("-----------------------"+data[0].comments);
      let comments = data[0].comments;
      comments.push({"user": req.body.username, "comment": req.body.userComment})
      console.log(comments)
      db.findOneAndUpdate({"headline": req.body.headline}, {$set: {"comments": comments}}, function(err, result){
        if(err){
          console.log(err);
        }
        else{
          console.log(result);
          res.end();
        }
      });
    }
  })
})

router.post('/findcomments', function(req, res){
  db.find({"headline":req.body.headline})
    .then(function(data){
      res.json(data[0].comments)
    })
})

module.exports = router;
