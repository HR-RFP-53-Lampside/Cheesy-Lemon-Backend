const Recipe = require('./index');

module.exports.addReview = (recipeId, review, cb) => {
  const query = { recipeId };
  const update = { $push: { reviews: review } };
  const options = {
    upsert: true, new: true, setDefaultsOnInsert: true, useFindAndModify: false,
  };
  Recipe.findOneAndUpdate(query, update, options, (error, res) => {
    if (error) {
      cb(error);
      return;
    }
    const newReviewId = res.reviews[res.reviews.length - 1].id;
    cb(newReviewId);
  });
};

module.exports.getReviews = (recipeId, cb) => {
  Recipe.find({ recipeId })
    .select('reviews')
    .exec((err, reviews) => cb(err, reviews));
};

module.exports.upvoteReview = (recipeId, reviewId, cb) => {
  Recipe.updateOne(
    { recipeId, 'reviews._id': reviewId },
    { $inc: { 'reviews.$.upvotes': 1 } },
  ).exec((err) => cb(err));
};

module.exports.deleteUpvoteReview = (recipeId, reviewId, cb) => {
  Recipe.findOne({ recipeId })
    .exec((err, recipe) => {
      // eslint-disable-next-line no-underscore-dangle
      const found = recipe.reviews.find((review) => review.id === reviewId);
      found.upvotes -= 1;
      // Validation (> 0) happening here
      recipe.save()
        .catch((error) => cb(error))
        .then(() => cb());
    });
};

module.exports.downvoteReview = (recipeId, reviewId, cb) => {
  Recipe.updateOne(
    { recipeId, 'reviews._id': reviewId },
    { $inc: { 'reviews.$.downvotes': 1 } },
  ).exec((err) => cb(err));
};

module.exports.deleteDownvoteReview = (recipeId, reviewId, cb) => {
  Recipe.findOne({ recipeId })
    .exec((err, recipe) => {
      // eslint-disable-next-line no-underscore-dangle
      const found = recipe.reviews.find((review) => review.id === reviewId);
      found.downvotes -= 1;
      // Validation (> 0) happening here
      recipe.save()
        .catch((error) => cb(error))
        .then(() => cb());
    });
};

module.exports.addComment = (recipeId, reviewId, body, authorName, cb) => {
  Recipe.updateOne(
    { recipeId, 'reviews._id': reviewId },
    { $push: { 'reviews.$.comments': { authorName, body } } },
  ).exec((err) => cb(err));
};
