var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const Sequelize = require('./models/index.js').sequelize;
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
const sequelize = require("./models").sequelize;

// Set views and view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Catabase connection
(async () => {
  try {
    await Sequelize.authenticate();
    Sequelize.sync();
    console.log('Database connection successful!');
  } catch (error) {
    console.error('Error connecting to the database: ', error);
  }
})();
app.use('/', indexRouter);
app.use('/users', usersRouter);

// Error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  err.message = 'Oops! It seems that page cannot be found.'; 
  res.status(404).render('page-not-found', { error: err });
});
// Global Error Handler
app.use((err, req, res, next) => {
  // Set default status and message
  err.status = err.status || 500; 
  err.message = err.message || 'Oops! Something went wrong.'; 

  // Log the error for debugging
  console.error(err.status, err.message);

  // Render the error template
  res.status(err.status).render('error', { error: err }); 
  res.render('error', {title: "Page Not Found", err});
});


module.exports = app;