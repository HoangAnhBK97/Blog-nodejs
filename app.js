var express = require("express");
var config = require("config");
var app = express();
var bodyParser = require("body-parser");
var path = require('path');
var session = require("express-session");
var controllers = require(__dirname + "/apps/controllers");
app.use(session({
    secret : config.get("secret_key"),
    resave : false ,
    saveUninitialized : true,
    cookie : { secure : false} 
}));
app.use('/static', express.static('public'))
app.use(bodyParser.urlencoded({extended : true}));
app.use( controllers);
app.use(bodyParser.json);

app.set("views", __dirname + "/apps/views");
app.set("view engine", "ejs");


var host = config.get("server.host");
var port = config.get("server.port");

app.listen(port, host, function(){
    console.log("Server is running on port " + port);
});