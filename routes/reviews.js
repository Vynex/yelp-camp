const expresss = require('express');
const router = expresss.Router({ mergeParams: true });

const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const catchAsync = require('../utils/CatchAsync');
const reviews = require('../controllers/reviews')


router.post('/', isLoggedIn, validateReview, catchAsync(reviews.create));

router.delete('/:rid', isLoggedIn, isReviewAuthor, catchAsync(reviews.destroy));




module.exports = router;