// Load required packages
var mongoose = require('mongoose');

// Define our user schema
var logSchema = new mongoose.Schema({
    exerciseId:     { type: String, required: true },
    userId:         { type: String, required: true },     
    dateCreated:    { type: Date, default: Date.now, required: true },
    
    sets:   { type: Number, default: 0 },
    reps:   { type: Number, default: 0 }, 
    weight: { type: Number, default: 0 },
    notes:  { type: String, default: "" },
    restTime: { type: Number, default: 0 }                            
});

// Export the Mongoose model
module.exports = mongoose.model('Log', logSchema);
