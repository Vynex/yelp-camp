const express = require('express');
const router = express.Router();


const catchAsync = require('../utils/CatchAsync');
const passport = require('../passport');
const users = require('../controllers/users');


router.route('/register')
    .get(users.registerForm)
    .post(catchAsync(users.register))


router.route('/login')
    .get(users.loginForm)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login);


router.get('/logout', users.logout);


module.exports = router;