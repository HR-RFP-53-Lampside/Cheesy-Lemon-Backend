const Recipe = require('./index');
const decorateRecipes = require('../server/helpers/decorateRecipes');

module.exports.getAllRecipes = (cb) => {
  Recipe.find({})
    .exec((err, result) => {
      const formatted = result.map((recipe) => ({
        recipeId: recipe.recipeId,
        favoriteCount: recipe.favoriteCount,
        reviewCount: recipe.reviews.length,
      }));

      decorateRecipes(formatted)
        .then((decorated) => cb(decorated));
    });
};

module.exports.addOrRemoveFavorite = (recipeId, active, cb) => {
  if (!active) {
    const query = { recipeId };
    const update = { $inc: { favoriteCount: 1 } };
    const options = {
      upsert: true, new: true, setDefaultsOnInsert: true, useFindAndModify: false,
    };

    Recipe.findOneAndUpdate(query, update, options, (error) => {
      if (error) {
        cb(error);
        return;
      }
      cb('Success');
    });
  } else {
    Recipe.findOne({ recipeId })
      .exec((err, recipe) => {
        if (!recipe) {
          cb('Cannot remove favorite before it was added', 400);
          return;
        }
        // eslint-disable-next-line no-param-reassign
        recipe.favoriteCount -= 1;
        // Validation (> 0) happening here
        recipe.save()
          .then(() => cb('Success'))
          .catch((error) => cb(error));
      });
  }
};

module.exports.getSingleReview = (recipeId, reviewId, cb) => {
  Recipe.findOne(
    { recipeId },
    {
      'reviews._id': reviewId,
      'reviews.headline': 1,
      'reviews.body': 1,
      'reviews.upvotes': 1,
      'reviews.downvotes': 1,
      'reviews.images': 1,
      'reviews.authorId': 1,
      'reviews._createdAt': 1,
    },
  )
    .exec((review, res) => {
      cb(res.reviews[0]);
    });
};

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

module.exports.deleteReview = (recipeId, reviewId, cb) => {
  const query = { recipeId };
  const update = { $pull: { reviews: { _id: reviewId } } };

  Recipe.updateOne(query, update, (error) => {
    cb(error);
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
      // console.log('found:', found);
      recipe.save()
        .then(() => cb())
        .catch((error) => cb(error));
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

module.exports.addComment = (recipeId, reviewId, body, authorId, cb) => {
  const query = { recipeId, 'reviews._id': reviewId };
  const update = { $push: { 'reviews.0.comments': { authorId, body } } };
  const options = { upsert: true, new: true, useFindAndModify: false };

  Recipe.findOneAndUpdate(query, update, options, (error, res) => {
    if (error) {
      cb(error);
      return;
    }
    // eslint-disable-next-line no-underscore-dangle
    const newCommentId = res.reviews.find((review) => review.id === reviewId).comments.pop()._id;
    cb(newCommentId);
  });
};

module.exports.deleteComment = (recipeId, reviewId, commentId, cb) => {
  const query = { recipeId, 'reviews._id': reviewId };
  const update = { $pull: { 'reviews.$.comments': { _id: commentId } } };

  Recipe.updateOne(query, update, (error) => {
    cb(error);
  });
};

module.exports.countYummies = (userId, cb) => {
  let yummieCount = 0;

  const deepfindAllAuthorIdOccurances = (array, authorId) => {
    array.forEach((item) => {
      if (item.reviews.authorId === authorId) {
        yummieCount += 1;
      }

      if (item.reviews.comments.length > 0) {
        item.reviews.comments.forEach((comment) => {
          if (comment.authorId === authorId) {
            yummieCount += 1;
          }
        });
      }
    });
  };

  Recipe.aggregate([{ $unwind: '$reviews' }])
    .then((result) => {
      deepfindAllAuthorIdOccurances(result, userId);
      cb({ yummieCount });
    })
    .catch((err) => cb(err));
};
