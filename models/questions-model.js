const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var questionsSchema = new Schema(
  {
    Name: String,
    description: String,
    listing_id: Number,
  },
  {
    timestamps: true
  }
);

// singular capitalized name for the mongo collection
module.exports = mongoose.model("Question", questionsSchema);
