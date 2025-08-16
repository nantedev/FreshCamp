const express = require('express');
const router = express.Router({ mergeParams: true }); // pour accéder à l'ID du campement
const reviews = require('../../controllers/api/reviews');
const catchAsync = require('../../utils/catchAsync');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../../middleware');

// POST nouvel avis pour un campement
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

// DELETE supprimer un avis
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;
