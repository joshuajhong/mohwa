if (process.env.NODE_ENV !== 'production') {
  require('dotenv').parse()
}

const express = require("express");
const app = express();
const expressLayouts = require('express-ejs-layouts')
const socket = require("socket.io");
const {MongoClient} = require('mongodb');
const bodyParser = require('body-parser')

const indexRouter = require('./routes/index')

app.set('view-engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))

const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))


app.use('/', indexRouter)

app.listen(process.env.PORT || 3000)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

// Connect and show databases
async function main(){
  /**
   * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
   * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
   */
  const uri = 'mongodb+srv://user:1DRqqqnnePfR6iV2@cluster0.5zwri.mongodb.net/user?retryWrites=true&w=majority'

  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
      // Connect to the MongoDB cluster
      await client.connect();

      // Make the appropriate DB calls
      await  listDatabases(client);

  } catch (e) {
      console.error(e);
  } finally {
      await client.close();
  }
}

main().catch(console.error);

async function listDatabases(client){
  databasesList = await client.db().admin().listDatabases();

  console.log("Databases:");
  databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

// login
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')

const initializePassport = require('./passport-config')
initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)

app.use(express.urlencoded({extended: false }))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

    // not for production - need to connect to database
const users = []

app.get('/', checkAuthenticated, (req, res) =>{
    res.render('index.ejs', { 
      name: req.user.name, 
      code: `
      <form action="/logout?_method=DELETE" method="POST">
        <button type="submit">Log Out</button>
      </form>`
    })
})

app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs', {
      name: `guest`,
      code: `
      <a href="/login">Log In/Sign Up</a>
      `
    })
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))


app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs')
})

app.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        res.redirect('/login')
    } catch {
        res.redirect('/register')
    }
})

app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
})

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }

    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}

// Chat app setup
const PORT = 5000;
const server = app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});

// Static files
app.use(express.static("public"));

// Socket setup
const io = socket(server);

const activeUsers = new Set();

io.on("connection", function (socket) {
  console.log("Made socket connection");

  socket.on("new user", function (data) {
    socket.userId = data;
    activeUsers.add(data);
    io.emit("new user", [...activeUsers]);
  });

  socket.on("disconnect", () => {
    activeUsers.delete(socket.userId);
    io.emit("user disconnected", socket.userId);
  });

  socket.on("chat message", function (data) {
    io.emit("chat message", data);
  });

  socket.on("typing", function (data) {
    socket.broadcast.emit("typing", data);
  });
});

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

var Message = mongoose.model('Message',{
  user : String,
  message : String,
  formattedTime : String
})

var dbUrl = 'mongodb+srv://user:1DRqqqnnePfR6iV2@cluster0.5zwri.mongodb.net/user?retryWrites=true&w=majority'

app.get('/messages', (req, res) => {
  Message.find({},(err, messages)=> {
    res.send(messages);
  })
})

app.post('/messages', (req, res) => {
  var message = new Message(req.body);
  message.save((err) =>{
    if(err)
      sendStatus(500);
    io.emit('message', req.body);
    res.sendStatus(200);
  })
})

mongoose.connect(dbUrl ,{useNewUrlParser: true, useUnifiedTopology: true } ,(err) => {
  console.log('mongodb connected',err);
})

// email subscription
var path = require('path')
const fetch = require('node-fetch');

// Bodyparser Middleware
app.use(bodyParser.urlencoded({extended: true}))

// Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Signup Route
app.post('/signup', (req, res) => {
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
      Authorization: 'auth 0a308f4a397de52f0a22c4688c0a079e-us2'
    },
    body: postData
  })
    .then(res.statusCode === 200 ?
      res.redirect('/success.html') :
      res.redirect('/fail.html'))
    .catch(err => console.log(err))
})

// nodemailer setup
const nodemailer = require('nodemailer'); 

let mailTransporter = nodemailer.createTransport({ 
  service: 'gmail', 
  auth: { 
      user: 'mohwaguitar@gmail.com', 
      pass: '))))!@*^%!jjh237'
  } 
}); 

// Contact form
const { body,validationResult } = require('express-validator');
const { dirname } = require("path");

var Contact = mongoose.model('Contact',{
  name : String,
  email : String,
  enquiry : String,
  message : String,
 // submitTime: String
})

app.get('/contact', (req, res) => {
  Contact.find({},(err, contact)=> {
    res.send(contact);
  })
})

app.post('/contact', (req, res) => {
  var contact = new Contact(req.body);
  const { name, email, enquiry, message } = req.body;
    if(!name || !email || !enquiry || !message) {
      res.redirect('/fail.html');
      return;
    }

  contact.save((err) =>{
    if(err)
      res.redirect('/fail.html');
    res.redirect('/sweet.html');
  })

  // send contact form to my email
  let mailContactForm = { 
    from: 'mohwaguitar@gmail.com', 
    to: 'joshuajhong@gmail.com', 
    subject: 'Contact Form', 
    html: `
    <p>You have a new contact request</p>
    <h3>Contact details</h3>
    <ul>
      <li>Name: ${req.body.name}</li>
      <li>Email: ${req.body.email}</li>
      <li>Enquiry: ${req.body.enquiry}</li>
    </ul>
    <h3>Message</h3>
      <p>${req.body.message}</p>`
  }; 

  mailTransporter.sendMail(mailContactForm, function(err, data) { 
    if(err) { 
        console.log('Error Occurs'); 
    } else { 
        console.log('Email sent successfully'); 
    } 
  }); 
})

// Booking form
var Booking = mongoose.model('Booking',{
  name : String,
  email : String,
  phone : Number,
  date : String,
  time : String,
  venue : String,
  address : String,
  venueAddress2 : String,
  suburb : String,
  postcode : Number,
  state : String,
  message : String,
})

app.get('/booking', (req, res) => {
  Booking.find({},(err, booking)=> {
    res.send(booking);
  })
})

app.post('/booking', (req, res) => {
  var booking = new Booking(req.body);

  booking.save((err) =>{
    if(err)
      res.redirect('/fail.html');
    res.redirect('/sweet.html');
  })

    // send booking form to my email
    let mailBookingForm = { 
      from: 'mohwaguitar@gmail.com', 
      to: 'joshuajhong@gmail.com', 
      subject: 'Booking Form', 
      html: `
      <p>You have a new booking request</p>
      <h3>Contact details</h3>
      <ul>
        <li>Name: ${req.body.name}</li>
        <li>Email: ${req.body.email}</li>
        <li>Phone: ${req.body.phone}</li>
        <li>Date: ${req.body.date}</li>
        <li>Time: ${req.body.time}</li>
      </ul>
      <h3>Venue details</h3>
      <ul>
        <li>Venue Name: ${req.body.venue}</li>
        <li>Venue Address: ${req.body.address}</li>
        <li>Venue Address (line 2): ${req.body.venueAddress2}</li>
        <li>Suburb: ${req.body.suburb}</li>
        <li>Postcode: ${req.body.postcode}</li>
        <li>State: ${req.body.state}</li>
      </ul>
      <h3>Message</h3>
        <p>${req.body.message}</p>`
    }; 
  
    mailTransporter.sendMail(mailBookingForm, function(err, data) { 
      if(err) { 
          console.log('Error Occurs'); 
      } else { 
          console.log('Email sent successfully'); 
      } 
    }); 
})

// 404 redirect
app.get('*', function(req, res){
  if (req.accepts('html')) {
    res.status(404).send('<script>location.href = "/pagenotfound.html";</script>');
    return;
  }
});

