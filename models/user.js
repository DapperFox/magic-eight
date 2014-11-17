var Mongoose = require('mongoose'),
    Schema = Mongoose.Schema;

var User = new Schema({
    username: { type: String, required: true},
    password: { type: String, required: true},
    salt: { type: String, required: true},
    token: { type: String, required: true },
    creationDate: {type: Date, required: true, default: Date.now}
});

module.exports = Mongoose.model('User', User);
