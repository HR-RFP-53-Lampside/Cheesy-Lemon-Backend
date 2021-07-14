const express = require('express');
const dbControllers = require('../database/controllers');

const router = express.Router();
router.use(express.urlencoded({ extended: false }));

router.put('/:recipeId/favorite', (req, res) => {
  const { active } = req.body;
  dbControllers.addOrRemoveFavorite(req.params.recipeId, active, (message, err) => {
    if (err) {
      res.status(400).send();
    }
    res.send(message);
  });
});

router.post('/:recipeId/reviews', (req, res) => {
  dbControllers.addReview(req.params.recipeId, req.body, (newId) => {
    res.send(newId);
  });
});

router.get('/:recipeId/reviews', (req, res) => {
  dbControllers.getReviews(req.params.recipeId, (err, reviews) => {
    if (err) {
      res.status(400).send();
    }
    res.send(reviews);
  });
});

router.put('/:recipeId/reviews/:reviewId/upvote', (req, res) => {
  const { recipeId, reviewId } = req.params;
  const { active } = req.body;
  if (!active) {
    dbControllers.upvoteReview(recipeId, reviewId, (err) => {
      if (err) {
        res.status(400).send();
      }
      res.send();
    });
  } else {
    dbControllers.deleteUpvoteReview(recipeId, reviewId, (err) => {
      if (err) {
        res.status(400).send();
      }
      res.send();
    });
  }
});

router.put('/:recipeId/reviews/:reviewId/downvote', (req, res) => {
  const { recipeId, reviewId } = req.params;
  const { active } = req.body;
  if (!active) {
    dbControllers.downvoteReview(recipeId, reviewId, (err) => {
      if (err) {
        res.status(400).send();
      }
      res.send();
    });
  } else {
    dbControllers.deleteDownvoteReview(recipeId, reviewId, (err) => {
      if (err) {
        res.status(400).send();
      }
      res.send();
    });
  }
});

router.post('/:recipeId/reviews/:reviewId/comment', (req, res) => {
  const { recipeId, reviewId } = req.params;
  const { body, authorName } = req.body;
  dbControllers.addComment(recipeId, reviewId, body, authorName, (id) => {
    res.send(id);
  });
});

router.delete('/:recipeId/reviews/:reviewId/comment/:commentId', (req, res) => {
  const { recipeId, reviewId, commentId } = req.params;
  dbControllers.deleteComment(recipeId, reviewId, commentId, (err) => {
    res.send(err);
  });
});

module.exports = router;
