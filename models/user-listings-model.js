const mongoose = require("mongoose");
var Schema = mongoose.Schema;
const Question = require("./questions-model");

var UserListingsSchema = new Schema(
  {
    Title: String,
    Category: String,
    Phone: String,
    Description: String,
    Image: String,
    id: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

UserListingsSchema.virtual("comments", {
  ref: "Question",
  localField: "id",
  foreignField: "Name",
  justOne: false,
});

// singular capitalized name for the mongo collection
// the collection in your database should be lowercase and plural
module.exports = mongoose.model("User_listing", UserListingsSchema);
