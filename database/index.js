const mongoose = require('mongoose');
const config = require('../config');

mongoose.connect(config.atlasCreds.url, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
// eslint-disable-next-line no-console
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  // eslint-disable-next-line no-console
  console.log('Connection to DB successful!');
});

const recipeSchema = new mongoose.Schema({
  recipeId: Number,
  favoriteCount: { type: Number, min: 0, default: 0 },
  reviews: [
    {
      authorName: String,
      // eslint-disable-next-line no-useless-escape
      authorId: String,
      headline: { type: String, maxLength: 50 },
      body: { type: String, maxLength: 1000 },
      _createdAt: { type: Date, default: Date.now },
      upvotes: { type: Number, min: 0, default: 0 },
      downvotes: { type: Number, min: 0, default: 0 },
      images: [
        // eslint-disable-next-line no-useless-escape
        { type: String },
      ],
      comments: [
        {
          authorId: String,
          body: String,
          _createdAt: { type: Date, default: Date.now },
        },
      ],
    },
  ],
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
