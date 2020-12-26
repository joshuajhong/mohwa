const mongoose = require("mongoose");

// Create Schema
const contactSchema = new mongoose.Schema({
        name: {
            type: String
        },
        email: {
            type: String
        },
        enquiry: {
            type: String
        },      
        message: {
            type: String
        }      
    });

module.exports = mongoose.model('Contact', contactSchema)

