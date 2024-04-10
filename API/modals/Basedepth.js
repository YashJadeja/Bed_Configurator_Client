const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Basedepths = new Schema({
  basedepth_id: { type: String },
  basedepth_name: { type: String },
  basedepth_image: { type: String },
});

module.exports = mongoose.model("basedepths", Basedepths);
