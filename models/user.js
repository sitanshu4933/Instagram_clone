const mongoose=require('mongoose')
const { ObjectId } = mongoose.Schema.Types


const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    pic:{
        type:String,
        default:"https://res.cloudinary.com/sitanshu/image/upload/v1605712607/download_zdiaol.png"
    },
    followers:[{type:ObjectId,ref:"users"}],
    followings:[{type:ObjectId,ref:"users"}]
})
mongoose.model('users',userSchema)