const express = require('express')
const app = express()
const mongoose = require('mongoose')
const { MONGOURI } = require('./keys')
const bodyParser = require('body-parser')

mongoose.connect(MONGOURI, {
    useUnifiedTopology: true, 
    useNewUrlParser: true
})
mongoose.connection.on('connected', () => {
    console.log("Connected to database!!")
})
mongoose.connection.on('err', (err) => {
    console.log(err)
})
require('./models/user')
require('./models/post')


// express body_parser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))

app.listen(80, (req, res) => {
    console.log("App started")
})