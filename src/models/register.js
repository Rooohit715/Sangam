const mongoose = require('mongoose');

const Alumini_Registration = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6 // Ensures password has at least 6 characters
    }
});

// Create model
const Register = mongoose.model("Register", Alumini_Registration);

module.exports = Register;
