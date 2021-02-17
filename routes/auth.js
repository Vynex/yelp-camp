const express = require('express');
const router = express.Router();

const User = require('../models/user');

const catchAsync = require('../utils/CatchAsync');

const passport = require('passport');


router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', catchAsync (async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username, password });
        await user.save();

        // add validations here
        req.flash('success', 'Welcome to YelpCamp!');
        res.redirect('/campgrounds');
    } catch (err) {

        req.flash ('error', err.message);
        res.redirect ('/register');
    }
}));

router.get('/login', (req, res) => {
    res.render('users/login');
});

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', `Welcome Back, ${req.user.username}!`);

    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
});

router.get('/logout', (req, res) => {
    req.logout();

    req.flash('success', 'Signed Out!');
    res.redirect('/campgrounds');
});


module.exports = router;