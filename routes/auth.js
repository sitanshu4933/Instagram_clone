const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model('users')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../client/config/keys')
const requirelogin = require('../middleware/requirelogin')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')
const crypto = require('crypto')
const {SENDGRID_API,EMAIL}=require('../client/config/keys')

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: SENDGRID_API
    }
}))

router.get('/', (req, res) => {
    res.send("Hello!")
})
// Post Register
router.post('/signup', (req, res) => {
    const { name, email, password, pic } = req.body
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
                password: hashedPassword,
                pic
            })
            user.save().then(user => {
                transporter.sendMail({
                    to: user.email,
                    from: "sitanshu4933@gmail.com",
                    subject: "signup success",
                    html: "<h1>Welcome to instagram</h1>"
                })
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
                const { _id, name, email, pic,following,followers } = savedUser
                res.json({ token, user: { _id, name, email, pic,following,followers } })
            }
            else {
                return res.status(422).json({ error: "Invalid email-id or password" })

            }
        }).catch(err => {
            console.log(err)
        })
    }).catch(err => {
        console.log(err)

    })
})
// Post Reset Password
router.post('/reset-password', (req, res) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err)
        }
        const token = buffer.toString("hex")
        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    return res.status(422).json({ error: "User not found" })
                }
                user.resetToken = token
                user.expireToken = Date.now() + 3600000
                user.save().then(result => {
                    transporter.sendMail({
                        to: user.email,
                        from: "sitanshu4933@gmail.com",
                        subject: "Reset Pasword",
                        html: `<p>You requested for Password reset</p>
                          <h5>click this <a href="${EMAIL}/reset/${token}">link  </a> to reset password</h5>`
                    })
                    res.json({ message: "Check your email" })
                })
            })
    })
})
// Post confirm reset Password
router.post('/new-password', (req, res) => {
    const { newPassword, token } = req.body
    User.findOne({ resetToken: token, expireToken: { $gt: Date.now() } })
        .then(user => {
            if (!user) {
                return res.status(422).json({ error: "session expired,try again" })
            }
            bcrypt.hash(newPassword, 12).then(hashedPassword => {
                user.password = hashedPassword
                user.resetToken = undefined
                user.expireToken = undefined
                user.save().then(saveduser => {
                    res.json({ message: "password reset successfully" })
                })
            })
        }).catch(err => {
            console.log(err)
        })
})
module.exports = router
