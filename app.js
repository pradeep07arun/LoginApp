var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var welcome = require('./routes/welcome');

var MongoClient = require('mongodb').MongoClient;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/welcome', welcome);

app.post('/registerUser', function (req, res) {
  var fname = req.body.firstname;
  var lname = req.body.lastname;
  var email = req.body.email;
  var password = req.body.password;

  console.log("Name: "+fname +" "+lname);

  MongoClient.connect("mongodb://localhost:27017/data", function(err, db) {
    if (err) return
    console.log("Connected");
    var collection = db.collection('users');
    var tokenTable = db.collection('logintable');

    console.log(collection.find({uemail: email}).count());

    if(collection.find({uemail: email}).count(function (e, count) {
      console.log(count);
      if(count == 0){
        collection.insert({ufirstname: fname, ulastname: lname, uemail: email, upassword: password}, function(err, result) {
          if(err){
            console.log(err);
            res.send({"error":"Somethign went wrong"});
          } else {

            if(tokenTable.find({uemail: email}).count(function (e, count) {
              if(count != 0){
                tokenTable.remove({uemail: email});
              }
              var token = "asdads";
              tokenTable.insert({uemail: email, uToken: token, uTime: Date()}, function(err, result) {
                  if(err){
                    console.log(err);
                    res.send({"error":"Somethign went wrong"});
                  } else {
                    res.send({"token":token});
                  }
              });
            }));
            
          }
        });
      } else {
        console.log("User Already Exists");
        res.send({"error":"User Already Exists"});
      }
    }));

  });
});

app.post('/loginUser', function (req, res) {
  var email = req.body.email;
  var password = req.body.password;


  MongoClient.connect("mongodb://localhost:27017/data", function(err, db) {
    if (err) return
    console.log("Connected");
    var collection = db.collection('users');


    if(collection.find({uemail: email, upassword: password}).count(function (e, count) {
      if(count > 0){
        res.send("lalalal");
      } else {
        res.send({"error":"Invalid Credentials"});
      }
    }));

  });

});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
