'use strict';

var Mongoose = require('mongoose');

var foretellRecord = Mongoose.Schema({
    question: {type: String, required: true},
    answer: { type: String, required: true },
    uid: { type: String, required: true }
});

module.exports = Mongoose.model('foretellRecord', foretellRecord);