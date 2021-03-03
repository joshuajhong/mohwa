const express = require('express')
const { body,validationResult } = require('express-validator');
const { dirname } = require("path");
const router = express.Router()
const Contact = require('../models/contact') 

router.get('/', (req, res) => {
  res.render('forms/contact.ejs')
})

// nodemailer setup
const nodemailer = require('nodemailer'); 

let mailTransporter = nodemailer.createTransport({ 
  service: 'gmail', 
  auth: { 
    user: process.env.DB_USER,
    pass: process.env.DB_PASS
  } 
}); 

// Contact form
router.post('/', (req, res) => {
  var contact = new Contact(req.body);
  const { name, email, enquiry, message } = req.body;
    if(!name || !email || !enquiry || !message) {
      res.redirect('/fail.html');
      return;
    }

  contact.save((err) =>{
    if(err) {
      res.redirect('/fail.html');
    } else {
      res.redirect('/sweet.html');
    }
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

module.exports = router