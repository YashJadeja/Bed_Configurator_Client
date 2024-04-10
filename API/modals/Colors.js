const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Colors = new Schema({
  color_id: { type: String },
  color_name: { type: String },
  color_image: { type: String },
});

module.exports = mongoose.model("colors", Colors);
