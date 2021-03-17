const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const { checkAuthenticated, checkNotAuthenticated } = require('../config/auth');
const methodOverride = require('method-override')

const passport = require('passport')
const session = require('express-session')

// Passport Config
const initializePassport = require('../config/passport')
initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)

// Express session
router.use(session({
  secret: process.env.SESSION_SECRET, //https://www.guidgenerator.com/online-guid-generator.aspx
  resave: false,
  saveUninitialized: false,
}))

// Passport middleware
router.use(passport.initialize())
router.use(passport.session())

router.get('/', function(req, res){
  if (req.user) {
      res.render('index', { 
        layout: 'layouts/specific',  
        name: req.user.name, 
        code: `
        <form action="/logout?_method=DELETE" method="POST">
          <button type="submit">LOG OUT <i class="fas fa-sign-out-alt"></i></button>
        </form>`
      });
  } else {
      res.render('index.ejs', { 
        layout: 'layouts/specific',  
        name: 'there this is mohwa', 
        code: `
        <form action="/logout?_method=DELETE" method="POST">
          <button type="submit">LOG IN <i class="fas fa-sign-in-alt"></i></button>
        </form>`
      })
  }
});

router.use(methodOverride('_method'))
router.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/user/login')
})

// email subscription
var path = require('path')
const fetch = require('node-fetch');

// Bodyparser Middleware
router.use(bodyParser.urlencoded({extended: true}))

// Static Folder
router.use(express.static(path.join(__dirname, 'public')));

// Signup Route
router.post('/signup', (req, res) => {
    const { firstName, lastName, email } = req.body;

    // Make sure fields are filled
    if(!firstName || !lastName || !email) {
        res.redirect('/fail.html');
        return;
    }

    // Construct req data
    const data = {
        members: [
            {
                email_address: email,
                status: 'subscribed',
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    const postData = JSON.stringify(data);

    fetch('https://us2.api.mailchimp.com/3.0/lists/f3686a1a79', {
    method: 'POST',
    headers: {
      Authorization: process.env.MAILCHIMP_API
    },
    body: postData
  })
    .then(res.statusCode === 200 ?
      res.redirect('/success.html') :
      res.redirect('/fail.html'))
    .catch(err => console.log(err))
})

module.exports = router
