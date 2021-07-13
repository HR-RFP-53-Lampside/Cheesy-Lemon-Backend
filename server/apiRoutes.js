/* eslint-disable no-plusplus */
const express = require('express');
const cloudinary = require('cloudinary');
const axios = require('axios');
const handleResponse = require('./helpers/handleResponse');
const TOKEN = require('../config');

const router = express.Router();
// cloudinary.config(config.cloudinaryCreds);
const mockIngredients = require('./mockIngredientsList');

router.get('/recipes', (req, res) => {
//  Mock Ingredients
  const allIngredients = req.body.ingredients || mockIngredients;
  const matchingRecipes = [];
  const promises = [];

  let i = 0;
  while (matchingRecipes.length < 20 && i < 1) {
    promises.push(
      axios({
        url: 'https://api.spoonacular.com/recipes/complexSearch',
        params: {
          apiKey: 'c42a21f8ef924ce0a56976daa8bd437b',
          // includeIngredients: mainIngredients[i],
          number: 100,
          fillIngredients: true,
          ignorePantry: true,
          offset: i++,
        },
      })
        // eslint-disable-next-line no-loop-func
        .then((recipes) => {
          // console.log(recipes.data.results);
          for (let j = 0; j < recipes.data.results.length; j++) {
            let haveAllIngredients = true;
            const recipeIngredients = recipes.data.results[j].missedIngredients;
            // console.log('Ingredients for recipe ' + j, recipeIngredients);
            for (let x = 0; x < recipeIngredients.length && haveAllIngredients; x++) {
              let currentIngredient = false;
              for (let y = 0; y < allIngredients.length && haveAllIngredients; y++) {
                const ingredient = recipeIngredients[x].name.toLowerCase();
                if (ingredient.includes(allIngredients[y].toLowerCase())) {
                  currentIngredient = true;
                  break;
                }
              }
              if (!currentIngredient) {
                haveAllIngredients = false;
              }
            }
            if (haveAllIngredients) {
              const recipeObject = {
                id: recipes.data.results[j].id,
                title: recipes.data.results[j].title,
                image: recipes.data.results[j].image,
              };
              matchingRecipes.push(recipeObject);
            }
          }
        })
        .catch((err) => {
          console.error(err);
          res.status(500);
          res.end();
        }),
    );
  }
  Promise.all(promises)
    .then(() => {
      res.end(JSON.stringify(matchingRecipes));
    });
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
