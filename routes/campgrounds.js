const expresss = require('express');
const router = expresss.Router();

const multer = require('multer');
const { storage } = require('../configs/cloudinary');
const upload = multer({ storage });

const { isLoggedIn, isAuthor, validateCamp } = require('../middleware');
const catchAsync = require('../utils/CatchAsync');
const campgrounds = require('../controllers/campgrounds');


router.get('/', catchAsync(campgrounds.index));

router.route('/new')
    .get(isLoggedIn, campgrounds.createForm)
    .post(isLoggedIn, upload.array('camp[image]'), validateCamp, catchAsync(campgrounds.create))

router.route('/:id')
    .get(catchAsync(campgrounds.show))
    .put(isLoggedIn, isAuthor, upload.array('camp[image]'), catchAsync(campgrounds.update))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.destroy));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.updateForm));



module.exports = router;