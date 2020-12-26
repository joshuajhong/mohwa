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


// File: ./config/passport
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt;
const fs = require('fs');
const path = require('path');

// Go up one directory, then look for file name
const pathToKey = path.join(__dirname, '..', 'id_rsa_pub.pem');

// The verifying public key
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');

// At a minimum, you must pass the `jwtFromRequest` and `secretOrKey` properties
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY,
  issuer: 'Mohwa',
  algorithms: ['RS256']
};


// The JWT payload is passed into the verify callback
passport.use('jwt', new JwtStrategy(options, function(jwt_payload, done) {
    // Since we are here, the JWT is valid!
    
    // We will assign the `sub` property on the JWT to the database ID of user
    User.findOne({_id: jwt_payload.sub}, function(err, user) {
        
        // This flow look familiar?  It is the same as when we implemented
        // the `passport-local` strategy
        if (err) {
            return done(err, false);
        }
        if (user) {
            
            // Since we are here, the JWT is valid and our user is valid, so we are authorized!
            return done(null, user);
        } else {
            return done(null, false);
        }
        
    });
    
}));
