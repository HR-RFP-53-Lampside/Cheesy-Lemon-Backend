const mongoose = require('mongoose');
const config = require('../config');

// mongoose.connect(config.atlasCreds.url, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
// eslint-disable-next-line no-console
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  // eslint-disable-next-line no-console
  console.log('Connection to DB successful!');
});

const recipeSchema = new mongoose.Schema({
  recipeId: Number,
  recipeName: String,
  reviews: [
    {
      recipeName: String,
      authorName: String,
      // eslint-disable-next-line no-useless-escape
      authorImageURL: { type: String, validate: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)}/ },
      headline: { type: String, maxLength: 50 },
      body: { type: String, maxLength: 1000 },
      upvotes: { type: Number, min: 0, default: 0 },
      downvotes: { type: Number, min: 0, default: 0 },
      comments: [{ authorName: String, body: String }],
      images: [
        {
          // eslint-disable-next-line no-useless-escape
          thumbnail: { type: String, validate: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)}/ },
          // eslint-disable-next-line no-useless-escape
          fullSize: { type: String, validate: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)}/ },
        },
      ],
    },
  ],
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
