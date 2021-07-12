/* eslint-disable no-plusplus */
const express = require('express');
const cloudinary = require('cloudinary');
// const config = require('../config');
const axios = require('axios');

const router = express.Router();

router.get('/recipes', (req, res) => {
//  console.log('GET REQUEST FOR RECIPES');
//  Mock Ingredients
  const mainIngredients = ['pasta', 'potato'];
  const allIngredients = `green bean
  red chile powder
  turmeric
  pumpernickel
  baguette
  baking powder
  unsweetened chocolate
  shish
  couscous
  arugula
  nosh
  muffin
  jelly
  rye
  basil
  sea cucumber
  parsley
  bok choy
  garlic
  breadcrumb
  walnut
  papaya
  mustard
  tonic water
  fennel seed
  potato
  pancake
  marionberry
  chutney
  marshmallow
  apple butter
  macaroni
  coconut ice cream
  hot sauce
  persimmon
  cannellini beans
  rice
  aspic
  caramel
  rosemary
  cornflake
  kidney bean
  watercress
  strawberry
  barbecue
  lemon zest
  tortilla
  pickle
  Marsala
  margarine
  pear
  coconut milk
  almond paste
  summer squash
  almond butter
  cremini mushrooms
  peaches
  vinegar
  tartar sauce
  toffee
  applesauce
  cranberry
  lemonade
  curry leaves
  black olive
  popcorn
  rice paper
  pepper
  date
  waffle
  cider
  panko bread crumbs
  celery
  pancetta
  squash
  pesto
  hoisin sauce
  maple syrup
  remoulade
  watermelon
  flax seed
  hash brown
  sorbet
  tamale
  coconut cream
  chip
  pumpkin seed
  coleslaw
  water
  apple cider vinegar
  tangerine
  almond milk
  zucchini
  chickpeas
  lentil
  cornstarch
  tomato juice
  potato chip
  provolone
  cooking wine
  eggplant
  wine
  chives
  kohlrabi
  radish
  legume
  tomatillo
  rose water
  onion powder
  baking soda
  cashew nut
  leek
  durian
  red cabbage
  wheat
  raspberry
  bouillon
  parsnip
  navy beans
  alfalfa sprout
  orange
  lima bean
  date sugar
  melon
  corn
  barley
  cornmeal
  curry powder
  cantaloupe
  chocolate
  mustard seeds
  pineapple
  pea beans
  oil
  ginger ale
  chipotle pepper
  raisin
  lemon
  sweet pepper
  cumin
  citrus
  brussels sprout
  pomelo
  five-spice powder
  Tabasco sauce
  dried leek
  tapioca
  bagel
  sour cream
  sherbet
  oats
  rum
  flour
  spud
  quinoa
  snow pea
  peas
  truffle
  oatmeal
  asparagus
  yeast
  noodle
  pita bread
  toast
  poppy seed
  mint
  tomato puree
  lettuce
  sweet chilli sauce
  seaweed
  carrot
  allspice
  blackberry
  strudel
  vegemite
  peanut butter
  plum
  kale
  romaine lettuce
  mango
  wine vinegar
  rice vinegar
  succotash
  prune
  guacamole
  heavy cream
  white bean
  water chestnut
  coconut yogurt
  pecans
  horseradish
  acorn squash
  licorice
  syrup
  apple
  acorn
  pretzel
  maraschino cherry
  soy milk
  blueberry`.split('\n  ');
  console.log(allIngredients);

  const matchingRecipes = [];
  const promises = [];

  for (let i = 0; i < mainIngredients.length; i++) {
    promises.push(
      axios({
        url: 'https://api.spoonacular.com/recipes/complexSearch',
        params: {
          apiKey: '08ef9a2f826c4772adcf01e60b256174',
          includeIngredients: mainIngredients[i],
          number: 50,
          fillIngredients: true,
          ignorePantry: true,
        },
      })
        // eslint-disable-next-line no-loop-func
        .then((recipes) => {
          console.log(recipes.data.results);
          for (let j = 0; j < recipes.data.results.length; j++) {
            let haveAllIngredients = true;
            const recipeIngredients = recipes.data.results[j].missedIngredients;
            // console.log('Ingredients for recipe ' + j, recipeIngredients);
            for (let x = 0; x < recipeIngredients.length && haveAllIngredients; x++) {
              let currentIngredient = false;
              for (let y = 0; y < allIngredients.length && haveAllIngredients; y++) {
                if (recipeIngredients[x].name.includes(allIngredients[y])) {
                  currentIngredient = true;
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
