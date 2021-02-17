const expresss = require('express');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const router = expresss.Router({ mergeParams: true });

const reviews = require('../controllers/reviews')


const catchAsync = require('../utils/CatchAsync');


router.post('/', isLoggedIn, validateReview, catchAsync (reviews.create));

router.delete('/:rid', isLoggedIn, isReviewAuthor, catchAsync (reviews.destroy));




module.exports = router;