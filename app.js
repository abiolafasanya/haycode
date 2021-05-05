const express = require('express');
const path = require('path');

//Database Mongoose Connection
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/haycode', {useNewUrlParser: true, useUnifiedTopology: true});
let db = mongoose.connection;

//check for connection
db.once('open', () => {
    console.log('Connected to MongoDB')
})

//check for db errors
db.on('error', (err) =>{
    console.log(err)
})

// Port
const port= 3000

// Init App
const app = express();

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
app.get('/', (req, res) => {
    try{
        Article.find({}, (err, article) => {
            res.render('index', {
                title: 'Welcome to Index Page',
                articles: article
            })
            article ? console.log(`${article} = = = > is running on index screen < = = = `) : console.log(err)
        })
    }
    catch(err) {
        console.log(err)
    }

})

// Add route
app.get('/articles/add', (req, res) => {
    res.render('add', {
        title: 'Articles'
    })
})

// Add submit post route
app.post('/articles/add', (req, res) => {
    let article = new Article();
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;
    try{
        article.save((err) =>{
            res.redirect('/')
            console.log('Article has been added')
        })
    }
    catch(err) {
        console.log(err)
    }

    console.log('Submiited Add article')
})

// Start Server
app.listen(port, () => {
    console.log(`Server running on ${port}`)
})
