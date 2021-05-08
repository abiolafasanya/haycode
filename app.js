if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express');
const path = require('path');
const { check, validationResult } = require('express-validator');
const flash = require('connect-flash')
const session = require('express-session')

// Database Connection
const db = require('./models/db')

// Port
const port= 3000

// Init App
const app = express();



//Express session
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: true,
    saveUninitialized: true
}));

//Express messages
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});


//Express parser
//Parser application/x-www-form-urlencoded
app.use(express.json());
// Parse application/json
app.use(express.urlencoded());

// Public folder
app.use(express.static(path.join(__dirname, 'public')))

let Article = require('./models/article')

// Load view Engine
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')


//Home Route
app.get('/',  (req, res) => {
    try{
        Article.find({}, (err, article) => {
            res.render('index', {
                title: 'Welcome to Index Page',
                articles: article
            })
        })
    }
    catch(err) {
        console.log(err)
    } 
})

// Article Route
let articleRoute = require('./router/article')
app.use('/article', articleRoute)

// Start Server
app.listen(port, () => {
    console.log(`Server running on ${port}`)
})
