var express = require("express");
var router = express.Router();
var post_md = require("../models/posts");

router.get("/", function(req, res){
    var data = post_md.get_all_post()
    if (data){
        data.then(function(posts){
            var results = {
                posts : posts,
                error : false 
            }
            res.render("blog/index", {data: results});
        }).catch(function(err){
            res.render("blog/index", {data: {error: "Get posts data error"}});
        })
    } else {
        res.render("blog/index", {data: {error: "Get posts data error"}});
    }
});
router.get("/post/:id", function(req, res){
    var  params = req.params 
    var id = params.id

    var data = post_md.getPostById(id)
    if(data){
        data.then(function(posts){
            var post = posts[0]
            var result = {
                post : post, 
                error : false 
            }
            res.render("blog/post", {data: result})
        }).catch(function(err){
            res.render("blog/post", {data: {error: "Could not get Post by Id"}})
        })
    } else {
        res.render("blog/post", {data: {error: "Could not get Post by Id"}})
    }
})
module.exports = router;