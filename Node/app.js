var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cors = require('cors');
var app = express();
const bodyParser = require('body-parser');
var fileupload = require("express-fileupload");
app.use(fileupload());

require('./src/db/connection');

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'public')));

//  *****MODELS****
var AdminRouter = require('./src/routes/admin');
var UserRouter = require('./src/routes/user');
var NgoRouter = require('./src/routes/ngo');
var DonationRouter = require('./src/routes/donation');

//  *****API ROUTES****
app.use('/admin', AdminRouter);
app.use('/user', UserRouter);
app.use('/ngo', NgoRouter);
app.use('/donation', DonationRouter);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// ************ ROUTES ******************//
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'home.html'));
});

app.get("/Admin.html", function (req, res) {
  res.sendFile(__dirname + "/Admin.html");
});

app.get('/admin_home', function (req, res) {
  res.render('admin_home');
});

app.get("/User.html", function (req, res) {
  res.sendFile(__dirname + "/User.html");
});

app.get("/NGOlogin.html", function (req, res) {
  res.sendFile(__dirname + "/NGOlogin.html");
});

app.get("/NGOSignUp.html", function (req, res) {
  res.sendFile(__dirname + "/NGOSignUp.html");
});

app.get("/UserSignUp.html", function (req, res) {
  res.sendFile(__dirname + "/UserSignUp.html");
});

app.get("/home.html", function (req, res) {
  res.sendFile(__dirname + "/home.html");
});

app.get("/User.html", function (req, res) {
  res.sendFile(__dirname + "/User.html");
});
// ************ ROUTES END******************//


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
