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
