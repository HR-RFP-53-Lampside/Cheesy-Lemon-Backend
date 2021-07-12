const express = require('express');
const dbControllers = require('../database/controllers');

const router = express.Router();
router.use(express.urlencoded({ extended: false }));

router.post('/:recipeId/reviews', (req, res) => {
  dbControllers.addReview(req.params.recipeId, req.body.review, (newId) => {
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

router.post('/:recipeId/reviews/:reviewId/upvote', (req, res) => {
  dbControllers.upvoteReview(req.params.recipeId, req.params.reviewId, (err) => {
    if (err) {
      res.status(400).send();
    }
    res.send();
  });
});

router.delete('/:recipeId/reviews/:reviewId/upvote', (req, res) => {
  dbControllers.deleteUpvoteReview(req.params.recipeId, req.params.reviewId, (err) => {
    if (err) {
      res.status(400).send();
    }
    res.send();
  });
});

router.post('/:recipeId/reviews/:reviewId/downvote', (req, res) => {
  dbControllers.downvoteReview(req.params.recipeId, req.params.reviewId, (err) => {
    if (err) {
      res.status(400).send();
    }
    res.send();
  });
});

router.delete('/:recipeId/reviews/:reviewId/downvote', (req, res) => {
  dbControllers.deleteDownvoteReview(req.params.recipeId, req.params.reviewId, (err) => {
    if (err) {
      res.status(400).send();
    }
    res.send();
  });
});

router.post('/:recipeId/reviews/:reviewId/comment', (req, res) => {
  const { body, authorName } = req.body;
  dbControllers.addComment(req.params.recipeId, req.params.reviewId, body, authorName, (err) => {
    if (err) {
      res.status(400).send();
    }
    res.send();
  });
});

module.exports = router;
