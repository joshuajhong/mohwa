const express = require('express')
const { body,validationResult } = require('express-validator');
const { dirname } = require("path");
const router = express.Router()
const Contact = require('../models/contact') 
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const nodemailer = require('nodemailer'); 

router.get('/', (req, res) => {
  res.render('forms/contact.ejs')
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
    from: process.env.DB_USER,
    to: `${process.env.EMAIL_PERSONAL}, ${req.body.email}`,
    subject: 'Contact Form', 
    html: `
    <p>Thanks for getting in touch, here is what you have sent:</p>
    <h3>Contact details</h3>
    <ul>
      <li>Name: ${req.body.name}</li>
      <li>Email: ${req.body.email}</li>
      <li>Enquiry: ${req.body.enquiry}</li>
    </ul>
    <h3>Message</h3>
      <p>${req.body.message}</p>`
  }; 

  sendEmail(mailContactForm, function(err, data) { 
    if(err) { 
        console.log('Error Occurs'); 
    } else { 
        console.log('Email sent successfully'); 
    } 
  });
})

module.exports = router