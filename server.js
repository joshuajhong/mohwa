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
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

const indexRouter = require('./routes/index')
const blogRouter = require('./routes/blogs') 
const contactRouter = require('./routes/contacts') 
const bookingsRouter = require('./routes/bookings')
const userRouter = require('./routes/user')
const onlyfriendsRouter = require('./routes/onlyfriends')
const pagesRouter = require('./routes/pages')
const adminpanelRouter = require('./routes/adminpanel')

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
app.use('/onlyfriends', onlyfriendsRouter)
app.use('/', pagesRouter)
app.use('/adminpanel', adminpanelRouter)

const PORT = 3000;
const http = require('http')
const server = http.createServer(app);
server.listen(process.env.PORT || PORT, function () {
  console.log(`Listening on port ${PORT}`)
})

// Passport Config
const initializePassport = require('./config/passport')
initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)

// Express body parser
app.use(express.urlencoded({ extended: true }));

const MongoStore = require('connect-mongo')(session);
const URI = process.env.DATABASE_URL;
const store = new MongoStore({ url: URI });

// Express session
const sessionMiddleware = session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false, store: store })
app.use(sessionMiddleware);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// experimenting with web sockets below
const socket = require("socket.io");
const io = socket(server);

// convert a connect middleware to a Socket.IO middleware
const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

io.use(wrap(sessionMiddleware));
io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));

// authentication not working???? 
io.use((socket, next) => {
  if (socket.request.user) {
    next();
  } else {
    next(new Error('unauthorized'))
  }
});

io.on('connect', (socket) => {
  console.log(`new connection ${socket.id}`);
  socket.on('whoami', (cb) => {
    cb(socket.request.user ? socket.request.user.email : '');
  });

  const session = socket.request.session;
  console.log(`saving sid ${socket.id} in session ${session.id}`);
  session.socketId = socket.id;
  session.save();
});

// 404 redirect
app.get('*', function(req, res){
  if (req.accepts('html')) {
    res.status(404).send('<script>location.href = "/pagenotfound.html";</script>');
    return;
  }
});