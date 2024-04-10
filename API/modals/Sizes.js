const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Sizes = new Schema({
  size_id: { type: String },
  size_name: { type: String },
  size_image: { type: String },
});

module.exports = mongoose.model("sizes", Sizes);
