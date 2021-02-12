const { authenticate } = require('passport')
const passport = require('passport');
const LocalStrategy = require('passport-local')
const bcrypt = require('bcrypt')
const User = require('./../models/users')

function initialize(passport) {
    const authenticateUser = async (email, password, done) => {
        User.findOne({ email: email })
        .then(user => {
            if (user == null) {
                return done(null, false, { message: "Incorrect ID or password" })
            }

            try {
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err;

                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, { message: "Incorrect ID or password" });
                    }
                });
            } catch (e) {
                return done(e)
            }
        })
    }

    passport.use('login', new LocalStrategy({ usernameField: 'email' }, authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
}

module.exports = initialize