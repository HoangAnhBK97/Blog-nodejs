var Posts = require("../models/postModel")
var Comments = require("../models/commentModel")
var mongoose = require("mongoose")
var multer = require("multer")

var storage = multer.diskStorage({
    destination : function(req, file, cb){
        cb(null, './public/images')
    } , 
    filename: function(req, file, cb){
        cb(null, file.originalname)
    }
})

var upload = multer({storage: storage})


function getPosts(res){
    Posts.find(function(err, posts){
        if(err) {
            res.render("admin/home", {data:{error: "Could not get Post from Database"}})
        } else {
            res.render("admin/home", {data: {posts: posts, error: false}})
        }
    })
}

module.exports = function(app){
    //get all posts
    app.get("/admin", function(req, res){
       if (req.session.user){
        getPosts(res)
       } else {
           res.redirect("/admin/login")
       }
       
    })
    app.get("/admin/post", function(req, res){
        if (req.session.user)
        {
            getPosts(res)
        }   else {
            res.redirect("/admin/login")
        }     
 
    })

    //get details post
    app.get("/blog/post/:id", function(req, res){
        Posts.findById({_id: req.params.id}, function(err, post){
            if(err){
                res.status.send(500)
            } else {
                var binhluan = []
                Comments.find({'idPost':req.params.id} ,function(err, comments){
                    if (err){
                        res.send(err)
                    } else {
                        binhluan  = comments 
                        res.render("blog/post",{data : {post:post, comments : binhluan, error:false}})
                    }

                })     
            }
        })
    })

    app.get("/admin/post/new", function(req, res){
        if (req.session.user){
            res.render("admin/posts/new", {data:{}})
        } else {
            res.redirect("/admin/login")
        }
       
    })
    //create new comment
    app.post("/blog/comment", function(req, res){
        var params = req.body 
        var comment = {
            idPost: params.idPost,
            name: params.name,
            content: params.comment,
            created_at : new Date()
        }
        Comments.create(comment, function(err,comment){
            if (err){
                res.status.send(500)
            } else {
                res.redirect('back')
            }
        })
    })
    //create new post
    app.post("/admin/post/new", upload.single("image") ,function(req, res){  
        if (req.session.user){
            var params = req.body
            if (params.title.trim().length == 0){
                res.render("admin/posts/new", {data:{error: "Please enter the title !"}})
            } else if (params.content.trim().length == 0){
                res.render("admin/posts/new", {data:{error: "Please enter the content !"}})
            } else {
                var post = {
                    id: req.body.id,
                    title : req.body.title,
                    content : req.body.content,
                    author : req.body.author,
                    image: req.file.originalname,
                    created_at : new Date(),
                    updated_at : new Date()
                }
                Posts.create(post, function(err, post){
                    if (err){
                        res.render("admin/posts/new", {data:{error: err}})
                    } else {
                        getPosts(res)
                    }
                })
            }  
        } else {
            res.redirect("/admin/login")
        } 
       
    })

     //edit post
     app.get("/admin/post/edit/:id",function(req, res){
        if (req.session.user){
            Posts.findById({_id: req.params.id}, function(err, post){
                if(err){
                    res.render("admin/posts/edit",{data:{error: "Could not edit post"}})
                } else {
                    res.render("admin/posts/edit",{data:{post:post, error:false}})
                }
            })
        } else {
            res.redirect("/admin/login")
        }
       
    })
    
    app.put("/admin/post/edit", function(req, res){
        if (req.session.user)
        {           
                    Posts.update({
                        id: req.body.id
                    }, {
                        title: req.body.params.title,
                        content: req.body.params.content,
                        author: req.body.params.author
                    }, function(err,post){
                        if(err)
                        {
                            res.json({status_code : 500})
                        } else 
                        {
                            res.redirect("/admin/post")
                        }
                    })           
        }   else {
            res.redirect("/admin/login")
        }     
       
    })
    //delete post
    app.delete("/admin/post/delete", function(req, res){
        if (req.session.user){
            Posts.remove({
                _id: req.body.id
            }, function(err, post){
                if(err){
                    res.render("/admin/post", {data:{error:"Could not delete from database"}})
                }else {
                    res.json({status_code : 200})
                }
            })
           } else {
               res.redirect("/admin/login")
           }
        
    })
   
    //
    app.get("/about", function(req, res){
        res.render("blog/about")
    })
    app.get("/contact", function(req, res){
        res.render("blog/contact")
    })
    app.get("/blog", function(req, res){
        Posts.find(function(err, posts){
            if(err) {
                res.render("blog/index", {data:{error: "Could not get Post from Database"}})
            } else {
                res.render("blog/index", {data: {posts: posts, error: false}})
            }
        })
    })
}