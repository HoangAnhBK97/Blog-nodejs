var mongoose = require("mongoose")

var Schema = mongoose.Schema

var commentSchema = new Schema({
    idPost: String,
    name: String ,
    content: String ,
    created_at: Date
})

var Comments = mongoose.model("Comments", commentSchema)

module.exports = Comments