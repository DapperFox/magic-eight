var Mongoose = require('mongoose');

var foretell = Mongoose.Schema({
    fortune: {type: String, required: true},
    uid: { type: String, required: true },
    type: { type: String, default: 'Custom' }
});

module.exports = Mongoose.model('foretell', foretell);