const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Storages = new Schema({
  storage_id: { type: String },
  storage_name: { type: String },
  storage_image: { type: String },
});

module.exports = mongoose.model("storages", Storages);
