const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requirelogin=require('../middleware/requirelogin')
const Post=mongoose.model("Post")
const User=mongoose.model("users")

router.get('/user/:userid',requirelogin,(req,res)=>{
    User.findOne({_id:req.params.userid})
    .select("-password")
    .then(user=>{
        Post.find({postedby:req.params.userid})
        .populate("postedby","_id name")
        .exec((err,posts)=>{
            if(err){
                return res.status(422).json({error:err})
            }
            res.json({user,posts})
        })
    }).catch(err=>{
        return res.status(404).json({error:"user not found"})
    })
})

module.exports=router