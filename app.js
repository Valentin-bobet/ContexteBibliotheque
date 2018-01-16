var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
let passport = require('passport');
let Strategy = require('passport-local').Strategy;
let session = require('express-session');

var index = require('./routes/index');
var users = require('./routes/users');
var livre = require('./routes/livre');
var genre = require('./routes/genre');
var android = require('./routes/android');

let DAOUsers = require('./DAO/DAOUsers');
let DAOusers = new DAOUsers();

passport.use(new Strategy(
    function(username, password, done) {
        DAOusers.getUserByUsername(username ,
            function(err, user) {
                if (err) { return done(err); }
                if (!user) {
                    return done(null, false, { message: 'Incorrect username.' });
                }

                if (user.password !== password) {
                    return done(null, false, { message: 'Incorrect password.' });
                }
                return done(null, user);
            }
        );
    }
));

passport.serializeUser(
    function(user, callback) {
        callback(null, user.id);
    }
);
passport.deserializeUser(
    function(id, callback) {
        DAOusers.getUserById(id,
            function (err, user) {
                if (err) {
                    return callback(err);
                }
                callback(null, user);
            }
        );
    }
);


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);
app.use('/users', users);
app.use('/livre', livre);
app.use('/android', android);
app.use('/genre', genre);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
