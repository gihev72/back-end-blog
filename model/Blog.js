const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blogSchema = new Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  createdAt: { type: Date, default: Date.now },
  image: {
    type: String,
  },
});

module.exports = mongoose.model("Blog", blogSchema);
