const mongojs = require("mongojs");

const databaseUrl = "NYTimes";
const collections = ["Articles"];

const db = mongojs(databaseUrl, collections);

db.on("error", function(error) {
  console.log("Database Error:", error);
});

module.exports = db;
