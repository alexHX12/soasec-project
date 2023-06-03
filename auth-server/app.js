var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require("body-parser");
var cors = require('cors');
var jwt = require('jsonwebtoken');
const fs = require('fs');

const { dbConnection } = require("./dbConnection");

dbConnection.connectToDB();

function jwtVerify (req, res, next) {
  //console.log('verifying token...');
  const authHeader = String(req.headers['authorization'] || '');
  var token=null;
  if (authHeader.startsWith('Token ')) {
    token = authHeader.substring(6, authHeader.length);
  }else{
    res.status(404);
    res.end();
  }

  try {
    req.jwt_decoded = jwt.verify(token, fs.readFileSync('./public.pem'));
    //console.log(req.jwt_decoded);
    next()
  } catch(err) {
    console.log(err);
    console.log("Auth error");
    res.status(404);
    res.end();
  }
}

var rootRouter = require('./routes/root');
var apiRouter = require('./routes/api');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors())
app.use(cookieParser());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json('application/json'));


app.use('/', rootRouter);
app.use(jwtVerify);
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
