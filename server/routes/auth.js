const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model('users')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../keys')
const requirelogin=require('../middleware/requirelogin')

router.get('/', (req, res) => {
    res.send("Hello!")
})
// Post Register
router.post('/signup', (req, res) => {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
        return res.status(422).json({ error: "Please add all the fields" })
    }
    User.findOne({ email: email }).then((savedUser) => {
        if (savedUser) {
            return res.status(422).json({ error: "email already exists" })
        }
        bcrypt.hash(password, 12).then(hashedPassword => {
            const user = new User({
                name,
                email,
                password: hashedPassword
            })
            user.save().then(user => {
                res.json({ message: "saved successfully" })
            }).catch(err => {
                console.log(err)
            })
        })

    }).catch(err => {
        console.log(err)
    })
})
// Post Signin
router.post('/signin', (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(422).json({ error: "Add email or password" })
    }
    User.findOne({ email: email }).then(savedUser => {
        if (!savedUser) {
            return res.status(422).json({ error: "Invalid emailid or password" })
        }
        bcrypt.compare(password, savedUser.password).then(domatch => {
            if (domatch) {
                // res.json({ message: "successfully signedin" })
                const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET)
                const {_id,name,email}=savedUser
                res.json({token,user:{_id,name,email}})
            }
            else {
                return res.status(422).json({ error: "Invalid emailid or password" })

            }
        }).catch(err => {
            console.log(err)
        })
    }).catch(err => {
        console.log(err)

    })
})
// Get protected route
router.get('/protected',requirelogin,(req,res)=>{
    res.send("hello World!!")
})
module.exports = router
