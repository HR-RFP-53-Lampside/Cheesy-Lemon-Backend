const express = require('express');
const dbControllers = require('../database/controllers');

const router = express.Router();
router.use(express.urlencoded({ extended: false }));

router.get('/recipes', (req, res) => {
  dbControllers.getAllRecipes((result) => {
    res.send(result);
  });
});

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

router.delete('/:recipeId/reviews/:reviewId', (req, res) => {
  const { recipeId, reviewId } = req.params;
  dbControllers.deleteReview(recipeId, reviewId, () => {
    res.send();
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
  const { body, authorId } = req.body;
  dbControllers.addComment(recipeId, reviewId, body, authorId, (id) => {
    res.send(id);
  });
});

router.delete('/:recipeId/reviews/:reviewId/comment/:commentId', (req, res) => {
  const { recipeId, reviewId, commentId } = req.params;
  dbControllers.deleteComment(recipeId, reviewId, commentId, (err) => {
    res.send(err);
  });
});

router.get('/:userId/countYummies', (req, res) => {
  const { userId } = req.params;
  dbControllers.countYummies(userId, (count) => {
    res.send(count);
  });
});

module.exports = router;
