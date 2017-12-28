var express = require("express");
var router = express.Router();
var user_md = require("../models/users");
var helper = require("../helpers/helper");
var bcrypt = require("bcrypt")
var post_md = require("../models/posts");

router.get("/", function(req, res){
    if(req.session.user){
        var data = post_md.get_all_post();
        data.then(function(posts){
            var data = {
                posts : posts,
                error : false 
            }
            res.render("admin/home", {data: data})
        }).catch(function(err){
            res.render("admin/home", {data: {error: "Get posts data error"}});
        })
    } else {
        res.redirect("/admin/login")
    }
    
    
});
router.get("/signup", function(req, res){
    res.render("signup", {data : {}});
});
router.post("/signup", function(req, res){
    var user = req.body ;
    if (user.email.trim().length == 0){
        res.render("signup", {data : {error : "Email is required !!"}});
    }

    if (user.passwd != user.repasswd){
        res.render("signup", {data : {error : "Password is not match !"}});
    }
    if (user.passwd.trim().length == 0){
        res.render("signup", {data : {error : "Please type password !"}});
    }
    var hashpass = helper.hash_password(user.passwd);
    user = {
        email: user.email,
        password: hashpass,
        first_name: user.firstname,
        last_name: user.lastname
    };
    var result = user_md.addUser(user);
    result.then(function(data){
        res.redirect("/admin/login");
    }).catch(function(err){
        res.render("signup", {data: {error:"error"}});
    });
});

router.get("/login", function(req, res){
    res.render("login", {data: {}});
}) ;

router.post("/login", function(req, res){
    var params = req.body;
    if (params.email.trim().length == 0 ){
        res.render("login", {data : {error : "Please enter your email !!"}});
    } else {
        var data = user_md.getUserByEmail(params.email);
        if (data){
            data.then(function(users){
                var user = users[0]
                var status = helper.compare_password(params.password, user.password)
                if (status){
                    req.session.user = user ;
                    res.redirect("/admin");
                }else {
                    res.render("login", {data : {error : "Password Wrong !!"}});
                }
            });
        }else {
            res.render("/login", {data: {error: "Email not exist !"}})
        }
    }
})

router.get("/post/new", function(req, res){
    if (req.session.user){
        res.render("admin/posts/new", {data:{error : false }})
    } else {
        res.redirect("/admin/login")
    }
   
})

router.post("/post/new", function(req, res){
    var params = req.body
    if (params.title.trim().length == 0){
        var data = {
            error : "Please enter the title !"
        }
        res.render("admin/posts/new", {data: data})
    } else {
        console.log(params)
        var data = post_md.addPost(params)
        data.then(function(result){
            res.redirect("/admin")
        }).catch(function(err){
            var data = {
                error : "Could not insert post to database !"
            }
            res.render("admin/posts/new", {data: data})
        })
    }
})

router.get("/post/edit/:id", function(req, res){
    if (req.session.user){
        var params = req.params
        var id = params.id
    
        var data = post_md.getPostById(id)
        if (data){
            data.then(function(posts){
                var post = posts[0]
                res.render("admin/posts/edit", {data: {post: post, error: false}})
            }).catch(function(err){
                res.render("admin/posts/edit",{data : {error : "Could not get Post by Id"} })
            })
        }else{
            res.render("admin/posts/edit",{data : {error : "Could not get Post by Id"} })
        }
    }else {
        res.redirect("/admin/login")
    }
    
    
})
router.put("/post/edit", function(req, res){
    var params = req.body
    var data = post_md.updatePost(params)
    if(data){
        data.then(function(result){
            res.json({status_code : 200})
        }).catch(function(err){
            res.json({status_code : 500})
        })
    } else {
        res.json({status_code : 500})
    }

})

router.delete("/post/delete", function(req, res){
    var post_id = req.body.id 
    var data = post_md.deletePost(post_id)
    if(data){
        data.then(function(result){
            res.json({status_code : 200})
        }).catch(function(err){
            res.json({status_code : 500})
        })
    } else 
    {
        res.json({status_code : 500})
    }
})
router.get("/users", function(req, res){
    if(req.session.user){
        var data = user_md.getAllUser();
        data.then(function(users){
            res.render("admin/user", {data : {
                users : users,
                error : false 
            }})
        }).catch(function(err){
            res.render("admin/user",{data : {error : "No user exist !"} })
        })
    } else {
        res.redirect("/admin/login")
    }
    
})
module.exports = router;