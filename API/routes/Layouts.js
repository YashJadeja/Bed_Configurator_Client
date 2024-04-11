var express = require("express");
var router = express.Router();
const Size = require("../modals/Sizes");
const Color = require("../modals/Colors");
const Storage = require("../modals/Storage");
const Headboard = require("../modals/Headboards");
const Basedepth = require("../modals/Basedepth");
const Layouts = require("../modals/Layouts");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

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

router.post("/:layout/:name", upload.single("files"), async function (req, res) {
  try {
    const { layout, name } = req.params;

    const timestamp = Date.now();
    const uniqueId = `${timestamp}`;

    let data = {
      [`${layout}_id`]: uniqueId,
      [`${layout}_name`]: name,
      [`${layout}_image`]: "uploads/" + req.file.filename,
    };

    const collection = layout.charAt(0).toUpperCase() + layout.slice(1);
    await eval(collection).create(data);
    res.status(200).json({ message: `${collection} added` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:layout/:name/:id", async function (req, res) {
  try {
    const { layout, name, id } = req.params;
    let data = {
      [`${layout}_name`]: name,
      [`${layout}_image`]: req.body.url,
    };

    const collection = layout.charAt(0).toUpperCase() + layout.slice(1);
    await eval(collection).updateOne({ [`${layout}_id`]: id }, { $set: data });
    res.status(200).json({ message: `${collection} updated` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:layout/:id", async function (req, res) {
  try {
    const { layout, id } = req.params;

    const collection = layout.charAt(0).toUpperCase() + layout.slice(1);

    const deletedItem = await eval(collection).findOneAndDelete({
      [`${layout}_id`]: id,
    });

    if (deletedItem) {
      res.status(200).json({ message: `${collection} deleted` });
    } else {
      res.status(404).json({ message: `${collection} not found` });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/layouts", async function (req, res) {
  try {
    const sizes = await Size.find();
    const colors = await Color.find();
    const storage = await Storage.find();
    const headboards = await Headboard.find();
    const basedepth = await Basedepth.find();

    res.status(200).json({
      size: sizes,
      color: colors,
      storage: storage,
      headboard: headboards,
      basedepth: basedepth,
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.get("/counts", async function (req, res) {
  try {
    const sizes = await Size.find();
    const colors = await Color.find();
    const storage = await Storage.find();
    const headboards = await Headboard.find();
    const basedepth = await Basedepth.find();

    res.status(200).json({
      size: sizes.length,
      color: colors.length,
      storage: storage.length,
      headboard: headboards.length,
      basedepth: basedepth.length,
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.post("/layouts", async function (req, res) {
  try {
    const data = req.body;
    const timestamp = Date.now();
    const uniqueId = `${timestamp}`;
    data["layout_id"] = uniqueId;
    const layouts = await Layouts.create(data);
    res.status(200).json({
      data: layouts,
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.post("/check_layout", async (req, res) => {
  try {
    const data = req.body;
    const newLayout = await Layouts.findOne(data);
    if (newLayout) {
      res.status(200).json({ data: newLayout });
    } else {
      res.status(201).json({ message: "Something Wrong!" });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.get("/:layout", async function (req, res) {
  try {
    const { layout } = req.params;
    const collection = layout.charAt(0).toUpperCase() + layout.slice(1);
    const sizes = await eval(collection).find();

    res.status(200).json({
      data: sizes,
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.post("/:layout", async function (req, res) {
  try {
    const { layout } = req.params;
    const layouts = await Layouts.find(req.body);
    const collection = layout.charAt(0).toUpperCase() + layout.slice(1);
    const data = await eval(collection).find();
    const returnData = data.map((item) => {
      const object = { ...item.toObject(), disable: true };
      return object;
    });

    const uniqueId = [];
    for (const item of returnData) {
      for (const item2 of layouts) {
        if (!uniqueId.includes(item[`${layout}_id`])) {
          if (item[`${layout}_id`] === item2[layout]) {
            item.disable = false;
            uniqueId.push(item[`${layout}_id`]);
          }
        }
      }
    }

    res.status(200).json({
      data: returnData,
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

module.exports = router;
