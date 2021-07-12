const express = require('express');
const cloudinary = require('cloudinary');
const config = require('../config');

const router = express.Router();

cloudinary.config(config.cloudinaryCreds);

router.post('/image-upload', (req, res) => {
  let values = Object.values(req.files);

  if (Array.isArray(values[0])) {
    // eslint-disable-next-line prefer-destructuring
    values = values[0];
  }

  const promises = values.map((image) => cloudinary.uploader.upload(image.path));

  Promise
    .all(promises)
    .then((results) => res.json(results));
});

module.exports = router;
