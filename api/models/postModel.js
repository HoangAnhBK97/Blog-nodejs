var mongoose = require("mongoose")

var Schema = mongoose.Schema

var postSchema = new Schema({
    title: String ,
    content: String ,
    author: String ,
    image: String,
    created_at: Date,
    updated_at: Date,
})

var Posts = mongoose.model("Posts", postSchema)

module.exports = Posts