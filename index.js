var Hapi = require('hapi'),
    Mongoose = require('mongoose'),
    Bcrypt = require('bcrypt'),
    Auth = require('hapi-auth-bearer-token'),
    server = new Hapi.Server('localhost', process.env.PORT || 3000);

console.log(process.env.PORT);

Mongoose.connect(process.env.MONGOHQ_URL);
var foretellModel = require('./models/foretell.js');
var userModel = require('./models/user.js');
var foretellRecord = require('./models/foretellRecord.js');

var loginValidate = function (username, password, callback) {
    userModel.findOne({
        username: username
    }, function (err, foundUser) {
        Bcrypt.compare(password, foundUser.password, function (err, isValid) {
            callback(err, isValid, foundUser);
        });
    });
};

var checkPassword = function (inputPassword, dbPassword, callback) {
    Bcrypt.compare(inputPassword, dbPassword, function (err, isValid) {
            callback(err, isValid);
        });
};

var validate = function (token, callback) {

    userModel.findOne({
        token: token
    }, function (err, user) {
        if (user) {
            callback(err, true, {
                token: token
            });
        } else {
            callback(err, false, {
                token: token
            });
        }
    });
};

server.pack.register(Auth, function (err) {
    server.auth.strategy('simple', 'bearer-access-token', {
        validateFunc: validate
    });


    server.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: 'public'
            }
        }
    });
    /*  --------------------------------
        Fortune Routes
        ------------------------------- */
    server.route({
        method: 'GET',
        path: '/v1/foretell',
        handler: function (req, res) {
            if (req.headers.authorization !== undefined) {
                var uid = req.headers.authorization.split(" ")[1];
            }
            foretellModel.find({
                type: 'Default'
            }, function (err, fortunes) {
                if (uid !== undefined) {
                    foretellModel.find({
                        uid: uid
                    }, function (err, custom) {
                        custom.forEach(function (item) {
                            fortunes.push(item);
                        });
                        var count = fortunes.length;
                        var fortune = fortunes[Math.floor(Math.random() * count)];
                        res(fortune);
                    });
                } else {
                        var count = fortunes.length;
                        var fortune = fortunes[Math.floor(Math.random() * count)];
                        res(fortune);
                }
            });
        }
    });

    server.route({
        method: 'GET',
        path: '/v1/foretell/record',
        config: {
            auth: 'simple'
        },
        handler: function (req, res) {
            var uid = req.headers.authorization.split(" ")[1];
            foretellRecord.find({
                uid: uid
            }, function (err, custom) {
                res(custom);
            });
        }
    });

    server.route({
        method: 'POST',
        path: '/v1/foretell/record',
        config: {
            auth: 'simple'
        },
        handler: function (req, res) {
            new foretellRecord({
                uid: req.payload.uid,
                question: req.payload.question,
                answer: req.payload.answer
            }).save(function (err, data) {
                if(err) {
                    res(err);
                }
                res(data);
            });
        }
    });

    server.route({
        method: 'GET',
        path: '/v1/foretell/custom',
        config: {
            auth: 'simple'
        },
        handler: function (req, res) {
            var uid = req.headers.authorization.split(" ")[1];
            foretellModel.find({
                uid: uid
            }, function (err, custom) {
                res(custom);
            });
        }
    });

    server.route({
        method: 'POST',
        path: '/v1/foretell',
        config: {
            auth: 'simple'
        },
        handler: function (req, res) {
            var uid = req.headers.authorization.split(" ")[1];
            var foretell = {
                fortune: req.payload.fortune,
                uid: uid
            };
            new foretellModel(foretell)
                .save(function (err, fortune) {
                    res(fortune);
                });
        }
    });

    server.route({
        method: 'PUT',
        path: '/v1/foretell/{id}',
        config: {
            auth: 'simple'
        },
        handler: function (req, res) {
            var uid = req.headers.authorization.split(" ")[1];
            foretellModel.findOneAndUpdate({
                _id: req.params.id,
                uid: uid
            }, {
                fortune: req.payload.fortune
            }, function (err, fortune) {
                res(fortune);
            });
        }
    });

    server.route({
        method: 'DELETE',
        path: '/v1/foretell/{id}',
        config: {
            auth: 'simple'
        },
        handler: function (req, res) {
            var uid = req.headers.authorization.split(" ")[1];
            foretellModel.findOneAndRemove({
                _id: req.params.id,
                uid: uid
            }, function (err, fortune) {
                res(fortune);
            });
        }
    });
    /*  --------------------------------
        Authentication Routes
        ------------------------------- */
    server.route({
        method: 'POST',
        path: '/auth/login',
        handler: function (req, res) {
            loginValidate(req.payload.username, req.payload.password, function (err, isValid, user) {
                if (err) {
                    res(err);
                }
                if (isValid) {
                    res(user.token);
                } else {
                    res(null);
                }
            });
        }
    });

    server.route({
        method: 'POST',
        path: '/auth/register',
        handler: function (req, res) {
            Bcrypt.genSalt(10, function (err, salt) {
                Bcrypt.hash(req.payload.password, salt, function (err, hash) {
                    var newUser = new userModel({
                        username: req.payload.username,
                        password: hash,
                        salt: salt,
                        token: require('hat')()
                    }).save(function (err, user) {
                        if (err) {
                            res(err);
                        }
                        res(user.token);
                    });
                });
            });
        }
    });

    server.route({
        method: 'GET',
        path: '/auth/user',
        config: {
            auth: 'simple'
        },
        handler: function (req, res) {
            var uid = req.headers.authorization.split(" ")[1];
            userModel.findOne({ token: uid }, function (err, user) {
                if(err) {
                    res(err);
                }
                res(user.username);
            });
        }
    });

    server.route({
        method: 'PUT',
        path: '/auth/user',
        config: {
            auth: 'simple'
        },
        handler: function (req, res) {
            var uid = req.headers.authorization.split(" ")[1];
            userModel.findOne({
                token: uid
            }, function(err, user) {
                if (err) {
                    res(err).code(401);
                } else {
                    checkPassword(req.payload.currentPass, user.password, function (err, isValid) {
                        if (isValid) {
                            Bcrypt.genSalt(10, function (err, salt) {
                                Bcrypt.hash(req.payload.newPass, salt, function (err, hash) {
                                    user.password = hash;
                                    user.save();
                                    res('Password Changed');
                                });
                            });
                        } else {
                            res('Password Invalid').code(401);
                        }
                    });
                }
            });
        }
    });


    server.start(function () {
        console.log('Server now running: ' + server.info.uri);
    });
});
