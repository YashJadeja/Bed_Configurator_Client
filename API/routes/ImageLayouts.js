var express = require("express");
var router = express.Router();
const ImageLayouts = require("../modals/ImageLayouts");
const Images = require("../modals/Images");
const Layouts = require("../modals/Layouts");

router.post("/image_layout", async (req, res) => {
  const data = req.body;
  const timestamp = Date.now();
  const uniqueId = `${timestamp}`;
  data.imageLayout_id = uniqueId;

  const images = [];
  for (const id of data.image_ids) {
    const image = await Images.findOne({ image_id: id });
    images.push(image);
  }
  const imageIds = images.map((image) => image.image_id);
  data.image_ids = imageIds;

  const newLayout = await ImageLayouts.create(data);
  if (newLayout) {
    res.status(200).json({ data: "ok" });
  } else {
    res.status(404).json({ message: "Something Wron" });
  }
});

router.get("/get_layout/:layout_id", async (req, res) => {
  const { layout_id } = req.params;
  const newLayout = await ImageLayouts.findOne({ layout_id: layout_id });
  const images = [];
  for (const id of newLayout.image_ids) {
    const image = await Images.findOne({ image_id: id });
    images.push(image);
  }
  if (images) {
    res.status(200).json({ data: images });
  } else {
    res.status(404).json({ message: "Something Wron" });
  }
});

router.get("/get_layout", async (req, res) => {
  const newLayout = await ImageLayouts.find();
  if (newLayout) {
    res.status(200).json({ data: newLayout });
  } else {
    res.status(404).json({ message: "Something Wron" });
  }
});

router.get("/default_bed", async (req, res) => {
  const newLayout = await ImageLayouts.findOne();
  const layout = await Layouts.findOne({ layout_id: newLayout.layout_id });
  const object = { ...newLayout.toObject(), layout: layout };

  if (object) {
    res.status(200).json({ data: object });
  } else {
    res.status(404).json({ message: "Something Wron" });
  }
});

router.get("/all_beds", async (req, res) => {
  const allLayouts = await ImageLayouts.find();
  const data = [];

  for (const item of allLayouts) {
    const layout = await Layouts.findOne({ layout_id: item.layout_id });
    const images = [];
    for (const id of item.image_ids) {
      const image = await Images.findOne({ image_id: id });
      images.push(image);
    }
    data.push({
      layout_id: item.layout_id,
      layout: layout,
      images: images,
    });
  }

  if (data) {
    res.status(200).json({ data: data });
  } else {
    res.status(404).json({ message: "Something Wron" });
  }
});

module.exports = router;
