const express = require('express');
const cloudinary = require('cloudinary');
const axios = require('axios');
const config = require('../config');
const handleResponse = require('./helpers/handleResponse');
const TOKEN = require('../config');

const router = express.Router();
cloudinary.config(config.cloudinaryCreds);

router.post('/image-upload', (req, res) => {
  let values = Object.values(req.files);

  if (Array.isArray(values[0])) {
    // eslint-disable-next-line prefer-destructuring
    values = values[0];
  }

  const promises = values.map((image) => cloudinary.uploader.upload(image.path));

  Promise.all(promises).then((results) => res.json(results));
});

router.get('/recipe/:id', (req, res) => {
  const { params } = req;
  axios({
    url: `https://api.spoonacular.com/recipes/${params.id}/information`,
    params: {
      apiKey: TOKEN.apiKey,
      id: 'id',
    },
  })
    .then((response) => {
      handleResponse(res, 200, response.data);
    })
    .catch((err) => {
      handleResponse(res, 400, err);
    });
});
router.get('/ingredients', (req, res) => {
  const { query } = req;
  axios({
    url: `https://api.spoonacular.com/food/ingredients/search?query=${query.query}`,
    params: {
      apiKey: TOKEN.apiKey,
    },
  })
    .then((response) => {
      handleResponse(res, 200, response.data);
    })
    .catch((err) => {
      handleResponse(res, 400, err);
    });
});

module.exports = router;
