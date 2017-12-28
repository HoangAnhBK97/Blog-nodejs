var express = require("express");
var router = express.Router();
var post_md = require("../models/posts");

router.use("/admin", require(__dirname + "/admin"));
router.use("/blog", require(__dirname + "/blog"));

router.get("/", function(req, res){
    var data = post_md.get_all_post()
    data.then(function(posts){
        var results = {
            posts : posts,
            error : false 
        }
        res.render("blog/index", {data : results})
    }).catch(function(err){
        res.render("admin/home", {data: {error: "Get posts data error"}});
    })

});
router.get("/about", function(req, res){
    res.render("blog/about")
})

module.exports = router;