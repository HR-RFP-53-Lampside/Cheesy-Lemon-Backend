/* eslint-disable no-plusplus */
const express = require('express');
const cloudinary = require('cloudinary');
// const config = require('../config');
const axios = require('axios');
const mockIngredients = require('./mockIngredientsList');

const router = express.Router();

router.get('/recipes', (req, res) => {
//  console.log('GET REQUEST FOR RECIPES');
//  Mock Ingredients
//  const mainIngredients = ['pasta', 'potato'];
  const allIngredients = req.body.ingredients || mockIngredients;
  console.log(allIngredients);

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
          //console.log(recipes.data.results);
          for (let j = 0; j < recipes.data.results.length; j++) {
            let haveAllIngredients = true;
            const recipeIngredients = recipes.data.results[j].missedIngredients;
            // console.log('Ingredients for recipe ' + j, recipeIngredients);
            for (let x = 0; x < recipeIngredients.length && haveAllIngredients; x++) {
              let currentIngredient = false;
              for (let y = 0; y < allIngredients.length && haveAllIngredients; y++) {
                if (recipeIngredients[x].name.toLowerCase().includes(allIngredients[y].toLowerCase())) {
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
