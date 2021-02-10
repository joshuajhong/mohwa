const mongoose = require("mongoose");

// Create Schema
const UserSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        password: {
            type: String,
            required: true
        },
       date: {
           type: Date,
           default: Date.now
       },
       role: {
           type: String,
           default: 'basic',
           enum: ["basic", "supervisor", "admin"]
       }
    });

module.exports = mongoose.model('User', UserSchema)



