const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
  user_id: { type: String },

  email: { type: String },
  password: { type: String },
});

module.exports = mongoose.model("users", User);
