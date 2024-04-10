const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Image = new Schema({
  image_id: { type: String },
  id: { type: String },

  image_data: {
    name: { type: String },
    url: { type: String },
    isOpen: { type: Boolean },
    isClose: { type: Boolean },
  },
});

module.exports = mongoose.model("images", Image);
