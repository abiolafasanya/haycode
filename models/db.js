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

module.exports = db