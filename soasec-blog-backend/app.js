var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
var jwt = require('jsonwebtoken');
const fs = require('fs');

const { dbConnection } = require("./dbConnection");
const { authSdk } = require('./auth_sdk');

dbConnection.connectToDB();
authSdk.getAuthToken().then(res=>{
  res.json().then(res2=>{
    global.access_token=res2.access_token;
    console.log(global.access_token);  
  });
});


var postRouter = require('./routes/post');
var authorRouter = require('./routes/author');

function jwtVerify (req, res, next) {
  console.log('verifying token...');
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
    console.log(req.jwt_decoded);
    next()
  } catch(err) {
    console.log(err);
    console.log("Auth error");
    res.status(404);
    res.end();
  }
}

var app = express();
app.use(cors());
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));
app.use(jwtVerify);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/posts', postRouter);
app.use('/authors', authorRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  console.log(err.message);
  // render the error page
  res.status(err.status || 500);
  res.send();
});

module.exports = app;
