// express library allows me to use methods such as get, post, put and delete for routing
// Body parser allows me to read data from a form in Node
// Morgan allow me to read all requests from users such as get and post
// Request is an api that allows me to fetch requests from a 3rd party api
// middle ware is like the tolls that manage the flow of request
// express session is an in memory store, this is a short term data store
// Mongo store keeps a data session stored in memory for the long term
// Flash requires express session and mongo store and renders flash messages to users

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const request = require('request');
const async = require('async');
const expressHbs = require('express-handlebars');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('express-flash');


// this constant allows me to instantiate express to be used
const app = express();


// mongodb://<dbuser>:<dbpassword>@ds147902.mlab.com:47902/nublymvp , this is how I connect to mongodb database

// This middleware is making the 'layout' page, this allows me to build multiple HTML pages and inherit design from layout
app.engine('.hbs',  expressHbs({ defaultLayout: 'layout', extname: '.hbs'}));
// This sets the view engine that I will be using
app.set('view engine', 'hbs');

// This creates a public directory where I can house images, CSS and JS files
app.use(express.static(__dirname + '/public'));

// bodyParser is my main middle ware that allows me to read the JSON files
app.use(bodyParser.json());
// allows me to read most characthers that a cpu can read
app.use(bodyParser.urlencoded({ extended: false }));
// allows me to read every request the user has made
app.use(morgan('dev'));

// this middleware allows me to use session
app.use(session({
  // this forces the seesion to save to the seesion store
  resave: true,
  // forces an initliazed session to be saved to the datastore
  saveUninitialized: true,
  // this is a secret used to sign the session id cookie
  secret: "mab777",
  // this sets a location to store a session for long term use
  store: new MongoStore({ url:'mongodb://root:mab415807@ds147902.mlab.com:47902/nublymvp'})
}));

// This teaches the application to use expess flash
app.use(flash());
// Remember, I must build all routes before app.listen
// allows me to make a get request for the home route
// 1e0d0973a9eb5fde119a9263e33951d1-us16 this is the api key for mail chimp
// 'https://us16.api.mailchimp.com/3.0/' , this is the root url for mail chimp, us must match api key ending
// /lists/{list_id}/members , will be used to update to new emails to my mail chimp list id (bbe142ab80)
// https://us16.api.mailchimp.com/3.0/lists/bbe142ab80/members
// Use app.route if there are multiple HTTP methods
app.route('/')
  .get((req, res, next) =>{
    res.render('main/home', { message: req.flash('success')});
  })
  .post((req, res, next) => {
    // capture users email using body parser, i can only use req.body.inputname if I use body parser
    // console.log(req.body.email)
    request({
      url:'https://us16.api.mailchimp.com/3.0/lists/bbe142ab80/members',
      method: 'POST',
      headers: {
        'Authorization': 'randomUser 1e0d0973a9eb5fde119a9263e33951d1-us16',
        'Content-Type': 'application/json'
      },
      json: {
        'email_address':req.body.email,
        'status': 'subscribed'
      }
    }, function(err, response, body){
      if(err) {
        console.log(err)
      } else {
        req.flash('success','Your all signed up, stay tuned!');
        res.redirect('/');
      }
    });
  });

// Use app.get for a single HTTP Method
// app.get('/', (req,res, next) => {
//   // this is a test response to see if route is active
//   //res.json("I am active") this responses with json
//   res.render('main/home');
// });

// allows me to establish a server to listen on a port
app.listen(3000, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("running on port 3000");
  }
});


 // use nodemon server.js to start the server
