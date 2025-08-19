// Load required packages
var mongoose = require('mongoose');

// Define our user schema
var UserSchema = new mongoose.Schema({
    name:   { type: String, required: true, unique: true },
    email:  { type: String, required: true, unique: true },
    uid:    { type: String, required: true, unique: true },
    logs:   { type: [String], default: [] },  
    exercises:      { type: [String], default: [] },
    dateCreated:    { type: Date, default: Date.now }       
});

// Export the Mongoose model
module.exports = mongoose.model('User', UserSchema);