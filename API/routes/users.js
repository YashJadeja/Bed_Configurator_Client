var express = require("express");
const User = require("../modals/user");
var router = express.Router();
const crypto = require("crypto");

const encrypt = (text) => {
  const cipher = crypto.createCipher("aes-256-cbc", "admin132");
  let encrypted = cipher.update(text, "utf-8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};

const decrypt = (text) => {
  const decipher = crypto.createDecipher("aes-256-cbc", "admin132");
  let decrypted = decipher.update(text, "hex", "utf-8");
  decrypted += decipher.final("utf-8");
  return decrypted;
};

// const decrypt = (text) => {
//   const decipher = crypto.createDecipher("aes-256-cbc", "e-mail");
//   let decrypted = decipher.update(text, "hex", "utf-8");
//   decrypted += decipher.final("utf-8");
//   return decrypted;
// };

router.post("/admin_register", async (req, res) => {
  const password = encrypt(req.body.password);

  const user = await User.create({
    email: req.body.email,
    password: password,
  });

  if (user) {
    res.status(200).json({ data: "ok" });
  } else {
    res.status(404).json({ message: "Something Wron" });
  }
});

router.post("/admin", async (req, res) => {
  console.log(req.body.password);
  const user = await User.findOne({
    email: req.body.email,
  });
  const password = decrypt(user.password);

  if (password === req.body.password) {
    res.status(200).json({ data: "ok", token: user.password });
  } else {
    res.status(404).json({ message: "Something Wron" });
  }
});

module.exports = router;
