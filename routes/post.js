const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requirelogin=require('../middleware/requirelogin')
const Post=mongoose.model("Post")

// Get all Posts
router.get('/allpost',requirelogin,(req,res)=>{
    Post.find()
    .populate('postedby',"name _id pic")
    .populate("comments.postedby","name _id")
    .then(posts=>{
        res.json({posts})
    }).catch(err=>{
        console.log(err)
    })
})
// Post CreatPost
router.post('/creatpost',requirelogin,(req,res)=>{
    const {title,body,photo}=req.body
    console.log(title,body,photo)
    if(!title || !body || !photo){
        return res.status(422).json({error:"Please fill all the fields"})
    }
    req.user.password="undefined"
    const post=new Post({
        title,
        body,
        photo,
        postedby:req.user
    })
    post.save().then(result=>{
        res.json({post:result})
    }).catch(err=>{
        console.log(err)
    })
})
// Get all Posts by me
router.get('/mypost',requirelogin,(req,res)=>{
    Post.find({postedby:req.user._id}).populate('postedby',"name _id").then(posts=>{
        res.json({myposts:posts})
    }).catch(err=>{
        console.log(err)
    })
})
// Put likes
router.put('/like',requirelogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postid,{
        $push:{likes:req.user._id}
    },{
        new:true
    }).exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})
// Put Unlikes
router.put('/unlike',requirelogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postid,{
        $pull:{likes:req.user._id}
    },{
        new:true
    }).exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})
// Put Comments
router.put('/comment',requirelogin,(req,res)=>{
    const comment={
        text:req.body.text,
        postedby:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postid,{
        $push:{comments:comment}
    },{
        new:true
    }).populate("comments.postedby","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})
// Delete Comments
router.put('/deletecomment',requirelogin,(req,res)=>{
    const commentid={
        _id:req.body.commentId
    }
    Post.findByIdAndUpdate(req.body.postid,{
        $pull:{comments:commentid}
    },{
        new:true
    }).populate("comments.postedby","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})
// DELETE  post
router.delete("/deletepost/:postid",requirelogin,(req,res)=>{
    Post.findOne({_id:req.params.postid})
    .populate("postedby","_id")
    .exec((err,post)=>{
        if(err || !post){
            return res.status(422).json({error:err})
        }
        if(post.postedby._id === req.user._id){
            post.remove()
            .then(result=>{
                // console.log("ccww")
                res.json(result)
            }).catch(err=>{
                console.log(err)
            })
        }
    })
})

module.exports=router