const axios = require('axios');
const config = require('../../config');

module.exports = (ingredients) => axios({
  method: 'post',
  url: 'https://api.spoonacular.com/recipes/parseIngredients',
  params: {
    apiKey: config.spoonacularCreds.api_key,
    ingredientList: ingredients,
    servings: 1,
    includeNutrition: false,
  },
})
  .then((result) => result.data)
  .then((data) => data.filter((item) => item.id > 0))
  .then((filtered) => filtered.map((item) => item.name));
