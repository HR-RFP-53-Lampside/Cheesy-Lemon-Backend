const Recipe = require('./index');

module.exports.addReview = (recipeId, review, cb) => {
  const query = { recipeId };
  const update = { $push: { reviews: review } };
  const options = {
    upsert: true, new: true, setDefaultsOnInsert: true, useFindAndModify: false,
  };
  Recipe.findOneAndUpdate(query, update, options, (error, res) => {
    if (error) return;
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

module.exports.downvoteReview = (recipeId, reviewId, cb) => {
  Recipe.updateOne(
    { recipeId, 'reviews._id': reviewId },
    { $inc: { 'reviews.$.downvotes': 1 } },
  ).exec((err) => cb(err));
};
