const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var questionsSchema = new Schema(
  {
    Name: String,
    description: String
  },
  {
    timestamps: true
  }
);

// singular capitalized name for the mongo collection
module.exports = mongoose.model("Question", questionsSchema);
