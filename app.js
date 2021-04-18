import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import passport from 'passport';

import indexRouter from './routes/index.js';
import deviceRouter from './routes/device.js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import dotenv from 'dotenv';
dotenv.config({path:'variables.env'});

import TokenStrategy from 'passport-accesstoken';
const strategyOptions = {
  tokenHeader: 'x-custom-token',
  tokenField: 'custom-token'
};

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/device', deviceRouter);

// Authentication middleware for devices
passport.use(new TokenStrategy.Strategy(strategyOptions,
  function (token, done) {
      User.findOne({token: token}, function (err, device) {
          if (err) {
              return done(err);
          }
          if (!user) {
              return done(null, false);
          }
          if (!user.verifyToken(token)) {
              return done(null, false);
          }
          return done(null, user);
      });
  }
));

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

export default app ;
