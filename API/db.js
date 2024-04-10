const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://Yash_raj_143:Yash1432@cluster0.mprq41x.mongodb.net/good-beds",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("MongoDB connection successful");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

module.exports = mongoose.connection;
