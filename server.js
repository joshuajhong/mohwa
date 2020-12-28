if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: '.env' });
}

const express = require("express");
const app = express();
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const passport = require('passport');
const session = require('express-session');
const flash = require('express-flash')
const helmet = require('helmet')
app.use(helmet());

const indexRouter = require('./routes/index')
const blogRouter = require('./routes/blogs') 
const contactRouter = require('./routes/contacts') 
const bookingsRouter = require('./routes/bookings')
const userRouter = require('./routes/user')

// EJS
app.set('view engine', 'ejs')
app.use(expressLayouts)
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false}))
app.use(express.urlencoded({extended: false }))
app.use(methodOverride('_method'))

// Static files
app.use(express.static(__dirname));
app.use(express.static('public'));

// mongoDB
const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true,  useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

// Routes
app.use('/', indexRouter) 
app.use('/blog', blogRouter) 
app.use('/contact', contactRouter)
app.use('/bookings', bookingsRouter)
app.use('/user', userRouter)

const http = require('http')
const server = http.createServer(app);
server.listen(process.env.PORT || 3000)

// Passport Config
const initializePassport = require('./config/passport')
initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
  session({
    secret: process.env.SESSION_SECRET, //https://www.guidgenerator.com/online-guid-generator.aspx
    resave: false,
    saveUninitialized: false,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Pages
app.get('/bookings', (req, res) => {
  res.render('forms/bookings.ejs')
})

app.get('/contact', (req, res) => {
  res.render('forms/contact.ejs')
})

const Blog = require('./models/blog') 
app.get('/blog', async (req, res) => {
  const blogs = await Blog.find().sort({
    createdAt: 'desc'
  })
  if (req.user) {
    res.render('blog/index.ejs', { 
        blogs: blogs,
        hide1: ``,
        hide2: `` 
    })
  } else {
    res.render('blog/index.ejs', { 
        blogs: blogs,
        hide1:`<!--`,
        hide2: `-->`   
    })
  }
})

app.get('/terms', (req, res) => {
  res.render('docs/terms')
})

app.get('/returns', (req, res) => {
  res.render('docs/returns')
})

app.get('/privacy', (req, res) => {
  res.render('docs/privacy')
})

app.get('/sitemap', (req, res) => {
  res.render('docs/sitemap')
})

app.get('/credits', (req, res) => {
  res.render('docs/credits')
})

// 404 redirect
app.get('*', function(req, res){
  if (req.accepts('html')) {
    res.status(404).send('<script>location.href = "/pagenotfound.html";</script>');
    return;
  }
});