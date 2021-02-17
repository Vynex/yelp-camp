const expresss = require('express');
const router = expresss.Router();

const { isLoggedIn, isAuthor, validateCamp } = require('../middleware');

const catchAsync = require('../utils/CatchAsync');

const campgrounds = require('../controllers/campgrounds');



router.get('/', catchAsync (campgrounds.index));

router.get('/new', isLoggedIn, campgrounds.createForm);

router.post('/new', isLoggedIn, validateCamp, catchAsync (campgrounds.create));

router.get('/:id', catchAsync (campgrounds.show));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync (campgrounds.updateForm));

router.put('/:id', isLoggedIn, isAuthor, catchAsync (campgrounds.update));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync (campgrounds.destroy));


module.exports = router;