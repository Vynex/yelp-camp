const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/user');

passport.serializeUser((user, done) => {
    done (null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

//local strategy
passport.use(
    new LocalStrategy({ usernameField: 'username' }, (username, password, done) => {
        User.findOne({ username })
            .then(user => {
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err;

                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, { message: 'Incorrect Username or Password' });
                    }
                });
            })
            .catch(err => {
                return done(null, false, { message: 'Incorrect Username or Password' });
        });
    })
);

module.exports = passport;