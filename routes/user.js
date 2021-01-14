const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const passport = require('passport');
const JWT = require('jsonwebtoken')
const utils = require('../config/utils')

const User = require('./../models/users')
const { checkAuthenticated, checkNotAuthenticated } = require('../config/auth');
// Validation
const { registerValidation, loginValidation } = require('./../config/validation')

// Passport Config
const initializePassport = require('../config/passport')
initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)

// Express body parser
router.use(express.urlencoded({extended: false }))

// these are needed for the messages ejs
const session = require('express-session');
router.use(session({
    secret: process.env.SESSION_SECRET, //https://www.guidgenerator.com/online-guid-generator.aspx
    resave: false,
    saveUninitialized: false,
}))
const flash = require('express-flash');
const { Router } = require('express');
router.use(flash())

// Passport middleware
router.use(passport.initialize())
router.use(passport.session())


router.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('loginsystem/login.ejs')
})

// passport local login
router.post('/login', checkNotAuthenticated, passport.authenticate('login', {
    successRedirect: '/',
    failureRedirect: '/user/login',
    failureFlash: true
}))

router.post('/login', function(req, res, next) {
    let errors = [];
    const { error } = loginValidation(req.body)
    if(error) {
        errors.push(req.flash('error', error.details[0].message ), res.render('loginsystem/login.ejs'))
    } else {
    passport.authenticate('login', function(err, user, info) {
        if (err) { return next(err); }
        if (!user) { 
            req.flash('error', 'Incorrect ID or password' )
            return res.render('loginsystem/login.ejs')
        }
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            else {
                User.findOne({ email: req.body.email })
                .then(user => {
                    res.status(200).redirect('/')
                });
            }
        });
    })(req, res, next);
    }
    }
);


// Validate an existing user and issue a JWT
/* router.post('/login', function(req, res, next) {
    passport.authenticate('login', function(err, user, info) {
        if (err) { return next(err); }
        if (!user) { 
            req.flash('error', 'Incorrect ID or password' )
            return res.render('loginsystem/login.ejs')
        }
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            else {
                User.findOne({ email: req.body.email })
                .then(user => {
                    const tokenObject = utils.issueJWT(user);
                    tokenObject
                    res.status(200).redirect('/')
                   // res.status(200).json({ success: true, token: tokenObject.token, expiresIn: tokenObject.expires });
                });
            }
        });
    })(req, res, next);
    }
);

// Load the user from "database" if token found
router.use(function(req, res, next) {
    if (req.tokenPayload) {
      req.user = users[req.tokenPayload.id];
    }
    if (req.user) {
      return next();
    } else {
      return res.status(401).json({ status: 'error', code: 'unauthorized' });
    }
  });
  
// Then set that token in the headers to access routes requiring authorization:
// Authorization: Bearer <token here>
router.get('/message', function(req, res) {
return res.json({
    status: 'ok',
    message: 'Congratulations ' + req.user.email + '. You have a token.'
});
});

router.get('/protected', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    res.status(200).send('If you get this data, you have been authenticated via JWT!');
}); */

router.get('/register', checkAuthenticated, (req, res) => {
    res.render('loginsystem/register.ejs')
})

router.post('/register', checkAuthenticated, async (req, res) => {
    let errors = [];
    const { error } = registerValidation(req.body)
    if(error) {
        errors.push(req.flash('exists', error.details[0].message ), res.render('loginsystem/register.ejs'))
    }   
    else {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (user) {      
            req.flash('exists', 'User already exists' )
            res.render('loginsystem/register.ejs')
            } 
            else { 
                try {
                const newUser = new User({ 
                    id: Date.now().toString(),
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password 
                });
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser
                            .save()
                            .then(res.redirect('/newuser.html'))
                        });
                    });
                } catch {
                res.redirect('/user/register')
                }
            }
        })
    }
})

  
module.exports = router