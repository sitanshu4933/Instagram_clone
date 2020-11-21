const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requirelogin = require('../middleware/requirelogin')
const Post = mongoose.model("Post")
const User = mongoose.model("users")

router.get('/user/:userid', requirelogin, (req, res) => {
    User.findOne({ _id: req.params.userid })
        .select("-password")
        .then(user => {
            Post.find({ postedby: req.params.userid })
                .populate("postedby", "_id name")
                .exec((err, posts) => {
                    if (err) {
                        return res.status(422).json({ error: err })
                    }
                    res.json({ user, posts })
                })
        }).catch(err => {
            return res.status(404).json({ error: "user not found" })
        })
})

router.put('/follow', requirelogin, (req, res) => {
    User.findByIdAndUpdate(req.body.followId, {
        $push: { followers: req.user._id }
    }, {
        new: true
    }, (err, result) => {
        if (err) {
            return res.status(422).json({ error: err })
        }
        User.findByIdAndUpdate(req.user._id, {
            $push: { followings: req.body.followId }
        }, {
            new: true
        }).select("-password")
            .then(result => res.json(result)
                .catch(err => {
                    return res.status(422).json({ error: errr })
                }))
    })
})
router.put('/unfollow', requirelogin, (req, res) => {
    User.findByIdAndUpdate(req.body.unfollowId, {
        $pull: { followers: req.user._id }
    }, {
        new: true
    }, (err, result) => {
        if (err) {
            return res.status(422).json({ error: err })
        }
        User.findByIdAndUpdate(req.user._id, {
            $pull: { followings: req.body.unfollowId }
        }, {
            new: true
        }).select("-password")
            .then(result => res.json(result)
                .catch(err => {
                    return res.status(422).json({ error: errr })
                }))
    })
})

router.put("/updatepic", requirelogin, (req, res) => {
    User.findByIdAndUpdate(req.user._id, {
        $set: { pic: req.body.pic }
    }, {
        new: true
    }, (err, result) => {
        if (err) {
            return res.status(422).json({ error: err })
        }
        res.json(result)
    })
})

module.exports = router