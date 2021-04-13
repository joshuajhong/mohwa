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

const oauth2Client = new OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN
});

async function createTransporter() {
  try {
    const accessToken = await oauth2Client.getAccessToken()

    const transport = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      service: "gmail",
      port: process.env.PORT || 3000,
      auth: {
        type: "OAuth2",
        user: process.env.DB_USER,
        accessToken,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN
      }
    }) 

    return transport;
  } catch (error) {
    return error
  }
}

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

  contact.save((err) => {
    if(err) {
      res.redirect('/fail.html');
    } else {
      res.redirect('/sweet.html');
    }
  })

  const mailContactForm = { 
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

  // send contact form to my email
  sendEmail(mailContactForm)
  .then(console.log('Email sent successfully'))
  .catch((error) => console.log(error.message))
})

module.exports = router