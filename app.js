'use strict';

/* global abs_path base_dir include */
global.base_dir = __dirname;

/**
 * @function abs_path convert relative server path to absolute path
 * @param {String} path the relative path regarding the server
 * @returns {String} the absolute path
 */
global.abs_path = function (path) {
  return global.base_dir + path;
};

/**
 * @function include require the requested module after converting its path to abs path
 * @param {String} file the relative path of the module regarding the server
 * @returns {*} the export object result from module.export of the included module
 */
global.include = function (file) {
  return require(global.abs_path(`/${file}`));
};

const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');

/*
  Drop the index if it exists
  Create it again define the mapping of the type
  Read the CSV file and index the documents in the index
 */

include('utils/loadCSVdata');

const Restaurant = include('models/Restaurant');
const restaurantRouter = include('routes/Restaurant')(Restaurant);

const app = express();
const port = process.env.PORT || 3000;


app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.get('/', (req, res) => {
  res.send('welcome to my first elasticsearch based API!');
});

app.use('/restaurant', restaurantRouter);
// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res) => {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stack traces leaked to user
app.use((err, req, res) => {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {}
  });
});


app.listen(port, () => {
  console.log(`Running on port: ${port}`);
});

module.exports = app;
