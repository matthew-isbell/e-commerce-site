var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var crypto = require('crypto');
var fileUpload = require('express-fileupload');
var fs = require('fs');





/*
  this is basic code from the authentication section from lectures
  almost nothing is changed, i just have the login and home page
  redirect to actual pages i've created already
*/
function hashPW(pwd) {
  return crypto.createHash('sha256').update(pwd).digest('base64').toString();
}

var app = express();
app.use(express.static(path.join(__dirname)));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser('MAGICString'));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));
app.use(fileUpload());

app.get('/home', function (req, res) {
  if (req.session.user) {
    //redirecting to the home.html page
    res.sendFile(path.join(__dirname, 'home.html'));
  } else {
    req.session.error = 'Access denied!';
    //redirecting to the login.html page if not signed in
    res.redirect('/login');
  }
});

app.get('/logout', function (req, res) {
  req.session.destroy(function () {
    res.redirect('/login');
  });
});

app.get('/login', function (req, res) {
  if (req.session.user) {
    //redirecting to the home.html page if successful sign in
    res.redirect('/home');
  } else {
    //redirecting to the login.html page
    res.sendFile(path.join(__dirname, 'login.html'));
  }
});

app.post('/login', function (req, res) {
  // user should be a lookup of req.body.username in database
  var user = { name: req.body.username, password: hashPW("myPass") };
  if (user.password === hashPW(req.body.password.toString())) {
    req.session.regenerate(function () {
      req.session.user = user;
      req.session.success = 'Authenticated as ' + user.name;
      console.log(user.name + " successfully logged in");
      res.redirect('/home');
    });
  } else {
    req.session.error = 'Authentication failed.';
    console.log("Entered incorrect credentials");
    res.redirect('/login');
  }
});





/*
  now is the new code
*/
app.post('/add-item', function (req, res) {
  console.log("add-item called")
  //when the /add-item is done in the home.html, it makes an object
  //which contains desc, image, price, and author
  const newItem = {
    name: req.body.name,
    image: `/public/images/${req.files.image.name}`,
    price: req.body.price,
    author: req.body.author
  };

  //saving the uploaded file to /public/images/....
  req.files.image.mv(`./public/images/${req.files.image.name}`, (err) => {
    //if there is an error, output it
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } 
    //otherwise move on to the storing data section
    else {
      //read in the current data.json file
      const data = JSON.parse(fs.readFileSync('data.json'));

      //pushing newest data
      data.push(newItem);

      //sending pushed data to the json file
      fs.writeFileSync('data.json', JSON.stringify(data));

      res.redirect('/home');
      console.log("New listing successfully created");
    }
  });
});

app.listen(3004);
console.log("Server is active on port 3004!");
