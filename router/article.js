const express = require('express')

const router = express.Router()

router.use(express.json())

const { check, validationResult } = require('express-validator');

// Article Model
let Article = require('../models/article')

// Add route
router.get('/add', (req, res) => {
    res.render('add', {
        title: 'Add Article'
    })
})

//Get single Article
router.get('/:id', (req, res) => {
    let id = req.params.id
    Article.findById(id, (err, article) => {
        if(err){
            console.log(err)
            return
        }
        res.render('article', {
            title: 'Article Page',
            article: article
        })
    })
})



// Add submit post route
router.post('/add', [ 
    check('title').notEmpty().withMessage('Title field is required'),
    check('body').notEmpty().withMessage('Message field is also required'),
    check('author').notEmpty().withMessage('Author  field is required')
],
async (req, res) => {
    
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.render('add', {
            title: 'Edit Form',
            error:errors.array()
        })
        return
    }

    let article = await new Article();
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;
    try{
        article.save((err) =>{
            req.flash('success', 'Article Added')
            res.redirect('/')
            console.log('Article has been added')
        })
    }
    catch(err) {
        console.log(err)
    }

    console.log('Submiited Add article')
})

// load edit form
router.get('/edit/:id', (req, res) => {
    Article.findById(req.params.id, (err, article) =>{
        if(err){
            console.log(err)
            return
        }
        res.render('edit', {
            title: 'Edit Article Page', 
            article: article
        })
    })
})

// Edit form
router.post('/edit/:id', async (req, res) => {
    let article = {}
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    let id = {_id: req.params.id}
    try{
        await Article.updateOne(id, article, (err) =>{
            if(err) {
                console.log(err)
                return
            }
            req.flash('success', 'Article Updated')
            res.redirect('/')

            console.log(id)
            console.log(`Article has been Updated with id: ${id._id}`)
        })
    }
    catch(err) {
        console.log(err)
    }

} )

// Delete article
router.get('/delete/:id', (req, res) => {
    let id = {_id: req.params.id}
    Article.findOneAndDelete(id, (err) => {
        if(err){
            console.log(err)
            return
        }
        req.flash('info', 'Article Deleted')
        res.redirect('/')
        console.log(`Article has been deleted`)
    })
})

module.exports = router