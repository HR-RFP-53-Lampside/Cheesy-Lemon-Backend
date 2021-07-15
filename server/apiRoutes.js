/* eslint-disable no-plusplus */
const express = require('express');
const cloudinary = require('cloudinary');
const axios = require('axios');
const Client = require('@veryfi/veryfi-sdk');
const config = require('../config');
const handleResponse = require('./helpers/handleResponse');
const filterIngredients = require('./helpers/filterIngredients');
const parseIngredients = require('./helpers/parseIngredients');
// const TOKEN = require('../config');

const router = express.Router();
cloudinary.config(config.cloudinaryCreds);

router.post('/image', (req, res) => {
  let values = Object.values(req.files);

  if (Array.isArray(values[0])) {
    // eslint-disable-next-line prefer-destructuring
    values = values[0];
  }

  const promises = values.map((image) => cloudinary.uploader.upload(image.path));

  Promise.all(promises).then((results) => res.json(results));
});

router.post('/recipes', (req, res) => {
  const allIngredients = req.body.ingredients;
  const { diet } = req.body;
  const matchingRecipes = [];
  const ingredientsQuery = allIngredients.join(',');
  axios({
    url: 'https://api.spoonacular.com/recipes/complexSearch',
    params: {
      apiKey: config.spoonacularCreds.api_key,
      includeIngredients: ingredientsQuery,
      number: 20,
      ignorePantry: true,
      diet,
    },
  })
    .then((recipes) => {
      for (let i = 0; i < recipes.data.results.length; i++) {
        const recipeObject = {
          id: recipes.data.results[i].id,
          title: recipes.data.results[i].title,
          image: recipes.data.results[i].image,
        };
        matchingRecipes.push(recipeObject);
      }
      res.end(JSON.stringify(matchingRecipes));
    })
    .catch(() => {
      res.status(500);
      res.end();
    });
});

router.get('/recipes/:id', (req, res) => {
  const { params } = req;
  axios({
    url: `https://api.spoonacular.com/recipes/${params.id}/information`,
    params: {
      apiKey: config.spoonacularCreds.api_key,
      id: 'id',
    },
  })
    .then((response) => {
      const responseObj = {
        title: response.data.title,
        id: response.data.id,
        summary: response.data.summary,
        instructions: response.data.instructions,
        extendedIngredients: response.data.extendedIngredients.map((item) => item.name),
        image: response.data.image,
        diets: response.data.diets,
      };
      handleResponse(res, 200, responseObj);
    })
    .catch((err) => {
      handleResponse(res, 400, err);
    });
});

router.get('/ingredients/:ingredientName/search', (req, res) => {
  const { ingredientName } = req.params;
  axios({
    url: `https://api.spoonacular.com/food/ingredients/search?query=${ingredientName}`,
    params: {
      apiKey: config.spoonacularCreds.api_key,
    },
  })
    .then((response) => {
      handleResponse(res, 200, response.data);
    })
    .catch((err) => {
      handleResponse(res, 400, err);
    });
});

router.get('/ingredientsFromImage', (req, res) => {
  const { imageUrl } = req.query;
  const {
    // eslint-disable-next-line camelcase
    client_id, client_secret, username, api_key,
  } = config.veryfiCreds;
  // eslint-disable-next-line camelcase
  const veryfi_client = new Client(client_id, client_secret, username, api_key);
  veryfi_client.process_document_url(imageUrl)
    .then((result) => filterIngredients(result))
    .then((filtered) => parseIngredients(filtered))
    .then((parsed) => res.send(parsed));
});

module.exports = router;
