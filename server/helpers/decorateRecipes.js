const axios = require('axios');
const config = require('../../config');

module.exports = (list) => {
  const promises = [];

  list.forEach((recipe) => {
    promises.push(new Promise((resolve) => {
      axios({
        url: `https://api.spoonacular.com/recipes/${recipe.recipeId}/information`,
        params: {
          apiKey: config.spoonacularCreds.api_key,
          id: 'id',
        },
      })
        .then((response) => ({
          title: response.data.title,
          summary: response.data.summary,
          image: response.data.image,
        }))
        .then((decoration) => {
          resolve({ ...recipe, ...decoration });
        })
        .catch(() => resolve());
    }));
  });

  return Promise.all(promises);
};
