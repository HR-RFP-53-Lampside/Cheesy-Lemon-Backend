const express = require('express');
const dbControllers = require('../database/controllers');

const router = express.Router();
router.use(express.urlencoded({ extended: false }));

router.post('/reviews/:recipeId', (req, res) => {
  dbControllers.addReview(req.params.recipeId, req.body.review, (newId) => {
    res.send(newId);
  });
});

router.get('/reviews/:recipeId', (req, res) => {
  dbControllers.getReviews(req.params.recipeId, (err, reviews) => {
    if (err) {
      res.status(400).send();
    }
    res.send(reviews);
  });
});

router.post('/reviews/:recipeId/:reviewId/upvote', (req, res) => {
  dbControllers.upvoteReview(req.params.recipeId, req.params.reviewId, (err) => {
    if (err) {
      res.status(400).send();
    }
    res.send();
  });
});

router.post('/reviews/:recipeId/:reviewId/downvote', (req, res) => {
  dbControllers.downvoteReview(req.params.recipeId, req.params.reviewId, (err) => {
    if (err) {
      res.status(400).send();
    }
    res.send();
  });
});

module.exports = router;
