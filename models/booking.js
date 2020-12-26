const mongoose = require("mongoose");

// Create Schema
const bookingSchema = new mongoose.Schema({
        name: {
            type: String
        },
        email: {
            type: String,
            required: true,
        },      
        phone: {
            type: Number
        },
        date: {
            type: String
        },
        time: {
            type: String
        },
        venue: {
            type: String
        },
        address: {
            type: String
        },
        venueAddress2: {
            type: String
        },
        suburb: {
            type: String
        },
        postcode: {
            type: Number
        },
        state: {
            type: String
        },
        message: {
            type: String
        }      
    });

module.exports = mongoose.model('Booking', bookingSchema)

