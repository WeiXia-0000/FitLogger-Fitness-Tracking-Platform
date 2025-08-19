// Load required packages
var mongoose = require('mongoose');

// Define our user schema
var exerciseSchema = new mongoose.Schema({
    userId: { type: String, default:""},     
    name:   { type: String, required: true, default:""},
    
    description:    { type: String, default:""},
    picURL:  { type: String, default:""},
    vidURL:  { type: String, default:""},
    bodyParts: { type: [String], default:[] }
});

// Export the Mongoose model
module.exports = mongoose.model('Exercise', exerciseSchema);
