const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ImageLayouts = new Schema({
  imageLayout_id: { type: String },

  layout_id: { type: String },
  image_ids: { type: Array },
});

module.exports = mongoose.model("imagelayouts", ImageLayouts);
