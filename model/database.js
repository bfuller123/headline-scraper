// const mongojs = require("mongojs");
//
// const databaseUrl = "NYTimes";
// const collections = ["Articles"];
//
// const db = mongojs(databaseUrl, collections);
//
// db.on("error", function(error) {
//   console.log("Database Error:", error);
// });
//
// module.exports = db;

const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var articleSchema = new Schema({
  headline: {
    type: String,
    required: true,
    unique: true
  },

  link: {
    type: String,
    required: true
  },

  summary: {
    type: String
  },

  comments: {
    type: Array
  }
}, {collection: "Articles"});

var Article = mongoose.model("Article", articleSchema);

module.exports = Article;
