const express = require('express')
const { body,validationResult } = require('express-validator');
const { dirname } = require("path");
const router = express.Router()
const Booking = require('../models/booking') 

// nodemailer setup
const nodemailer = require('nodemailer'); 

let mailTransporter = nodemailer.createTransport({ 
  service: 'gmail', 
  auth: { 
    user: process.env.DB_USER,
    pass: process.env.DB_PASS
  } 
}); 

// Booking form
router.post('/', (req, res) => {
  var booking = new Booking(req.body);

  booking.save((err) =>{
    if(err) {
      res.redirect('/fail.html');
    } else {
      res.redirect('/sweet.html');
    }
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

module.exports = router;