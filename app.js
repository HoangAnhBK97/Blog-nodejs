var express = require("express")
var socketio = require("socket.io")
var app = express()

var bodyParser = require("body-parser")
var morgan = require("morgan")
var mongoose = require("mongoose")
var session = require("express-session");
var muter = require("multer")

var config = require("./config")
var postController = require("./api/controllers/postController")
var userController = require("./api/controllers/userController")
var Posts = require("./api/models/postModel")


var port = process.env.PORT || 3000

app.use(session({
    secret : "secret_key",
    resave : false ,
    saveUninitialized : true,
    cookie : { secure : false} 
}));

app.use("/static", express.static(__dirname + "/public"))
app.set("view engine", "ejs")

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : true}))

app.use(morgan("dev"))

//console.log(config.getDbConnectionString())
mongoose.connect(config.getDbConnectionString(), {useMongoClient : true})
postController(app)
userController(app)

app.get("/", function(req, res){
    Posts.find(function(err, posts){
        if(err) {
            res.render("blog/index", {data:{error: "Could not get Post from Database"}})
        } else {
            res.render("blog/index", {data: {posts: posts, error: false}})
        }
    })
})
app.get("/mycv", function(req, res){
    res.render("blog/mycv")
})

app.get("/chat", function(req, res){
    res.render("chat")
})

var server = app.listen(port, function(){
    console.log("Server is listening on PORT : " +port)
})

var io = socketio(server)
var socketControl = require("./api/common/socketControl")(io)