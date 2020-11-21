const express = require('express')
const app = express()
const mongoose = require('mongoose')
const { MONGOURI } = require('./client/config/keys')
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

if(process.env.NODE_ENV=="production"){
    app.use(express.static('client/build'))
    const path=require('path')
    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}

app.listen(process.env.PORT || 80, (req, res) => {
    console.log("App started")
})