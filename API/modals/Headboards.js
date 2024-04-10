const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Headboards = new Schema({
  headboard_id: { type: String },
  headboard_name: { type: String },
  headboard_image: { type: String },
});

module.exports = mongoose.model("headboards", Headboards);
