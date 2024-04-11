var express = require("express");
var router = express.Router();
const multer = require("multer");
const fs = require("fs");
const Image = require("../modals/Images");
const path = require("path");
const axios = require("axios");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let destinationFolder = "../../Bed_Configurator_Client/src/uploads/";
    cb(null, destinationFolder);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname.replace(/\s/g, ""));
  },
});

const upload = multer({ storage: storage });

router.post("/insert/:name", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const imageName = req.params.name;
  const filePath = `../../Bed_Configurator_Client/src/uploads/${req.file.filename}`;

  const fileExtension = path.extname(req.file.filename);
  const newPath = `../../Bed_Configurator_Client/src/uploads/` + imageName + fileExtension;

  fs.rename(filePath, newPath, (err) => {
    if (err) {
      console.error("Error renaming file:");
    } else {
      console.log("File renamed successfully");
    }
  });

  const url = "uploads/" + imageName + fileExtension;
  if (url) {
    res.status(200).json({ url: url });
  } else {
    res.status(500).json({ message: "Something Wrong!" });
  }
});

router.post("/images", async (req, res) => {
  const data = req.body;
  for (const item of data) {
    const timestamp = Date.now();
    const uniqueId = `${timestamp}`;
    item.image_id = uniqueId + item.id;
  }

  try {
    const images = await Image.create(data);
    res.status(200).json({ data: images });
  } catch (error) {
    res.status(500).json({ message: "Error uploading images" });
  }
});

module.exports = router;
