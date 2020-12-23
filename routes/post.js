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
    .sort('-createdAt')
    .then(posts=>{
        res.json({posts})
    }).catch(err=>{
        console.log(err)
    })
})
// Get all posts of Followings
router.get('/followingposts',requirelogin,(req,res)=>{
    Post.find({postedby:{$in:req.user.following}})
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
    }).populate("postedby",'name _id pic')
    .exec((err,result)=>{
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
    }).populate("postedby",'name _id pic')
    .exec((err,result)=>{
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
    }).populate('postedby',"name _id pic")
    .populate("comments.postedby","name _id")
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
    }).populate('postedby',"name _id pic")
    .populate("comments.postedby","name _id")
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
        if(post.postedby._id.toString() === req.user._id.toString()){
            post.remove()
            .then(result=>{
                res.json(result)
            }).catch(err=>{
                console.log(err)
            })
        }
    })
})

module.exports=router