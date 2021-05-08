const express = require('express')

const router = express.Router()

router.use(express.json())

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

module.exports = router