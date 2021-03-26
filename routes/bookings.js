const express = require('express')
const { body,validationResult } = require('express-validator');
const { dirname } = require("path");
const router = express.Router()
const Booking = require('../models/booking') 
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const nodemailer = require('nodemailer'); 

router.get('/', (req, res) => {
  res.render('forms/bookings.ejs')
})

// nodemailer setup
const createTransporter = async () => {
  const oauth2Client = new OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN
  });

  const accessToken = await new Promise((resolve, reject) => {
    oauth2Client.getAccessToken((err, token) => {
      if (err) {
        reject();
      }
      resolve(token);
    });
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.DB_USER,
      accessToken,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN
    }
  });

  return transporter;
};

const sendEmail = async (emailOptions) => {
  let emailTransporter = await createTransporter();
  await emailTransporter.sendMail(emailOptions);
};

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
      from: process.env.DB_USER,
      to: `${process.env.EMAIL_PERSONAL}, ${req.body.email}`,
      subject: 'Booking Form', 
      html: `
      <p>Thanks for getting in touch, here is what you have sent:</p>
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
    sendEmail(mailBookingForm, function(err, data) { 
      if(err) { 
          console.log('Error Occurs'); 
      } else { 
          console.log('Email sent successfully'); 
      } 
    });
})

module.exports = router;