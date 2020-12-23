const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: true
    },
    likes: [{ type: ObjectId, ref: "users" }],
    comments: [{
        text: String,
        postedby: { type: ObjectId, ref: "users" }
    }],
    postedby: {
        type: ObjectId,
        ref: "users"
    }
},
    {
        timestamps: true
    })
mongoose.model("Post", postSchema)