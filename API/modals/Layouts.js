const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Layouts = new Schema({
  layout_id: { type: String },

  size: { type: String },
  color: { type: String },
  headboard: { type: String },
  basedepth: { type: String },
  storage: { type: String },
});

module.exports = mongoose.model("layouts", Layouts);
