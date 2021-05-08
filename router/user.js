const express = require('express')

const router = express.Router()

const { check, validationResult } = require('express-validator');

const bcrypt = require('bcrypt')

router.use(express.json())

//User model
let User = require('../models/user')


// Login Route
router.get('/login', (req, res) =>{
    res.render('auth/login', {
        title: 'Login Page'
    })
})

// Register Route
router.get('/register', (req, res) =>{
    res.render('auth/register', {
        title: 'Login Page'
    })
})

// login request handling
router.post('/register', async (req, res) =>{
    try{
            pass1 = req.body.password
            pass2 = req.body.passwordConfirmation
            if(pass1 !== pass2){
                req.flash('danger', 'Password does not match')
                res.redirect('./register')
                return
            }
            passwordHash = await bcrypt.hash(req.body.password, 10)
            let user = new User
            user.name = req.body.name
            user.email = req.body.email
            user.password = passwordHash

            user.save((err) => {
                if(err){
                    req.flash('danger', 'Server error try again later')
                    res.render('./register')
                    console.log(err)
                    return
                }
                req.flash('success', 'registration was successful')
                res.redirect('/')
            })
    }
    catch(err){
        console.log(err)
    }
})

// User login request
router.post('/login', (req, res) => {
    let usercheck = {email: req.body.email}
   
    User.findOne(usercheck, (err, user) => {
        if(err){
            console.log(err)
            return
        }
        console.log(user.password)
        let username = user.name
        console.log(username)
        bcrypt.compare(req.body.password, user.password, (err, result) => {
            if (err) {
                 console.log(err)
                 return
            }
            if(!result) {
                let error = new Error('Invalid password')
               console.log(error)
               req.flash('danger', 'Invalid Username/Password')
               res.render('./login')
               return
            }
            req.flash('success', `Welcome ${username}`)
            res.redirect('/')
        })
    })
})

module.exports = router