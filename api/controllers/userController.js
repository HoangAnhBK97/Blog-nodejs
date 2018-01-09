var Users = require("../models/userModel")

module.exports = function(app){
    app.get("/admin/users", function(req, res){
       if(req.session.user){
        Users.find(function(err, users){
            if(err) {
                res.render("admin/user", {data:{error: "Could not get Post from Database"}})
            } else {
                res.render("admin/user", {data: {users: users, error: false}})
            }
        })
       } else {
           res.redirect("/admin/login")
       }
        
    })

    app.get("/admin/signup", function(req, res){
        res.render("admin/signup", {data:{}})
    })
    //create new post
    app.post("/admin/signup",function(req, res){   
        var params = req.body
        if (params.email.trim().length == 0){
            res.render("admin/signup", {data:{error: "Please enter your email !"}})
        } else {
            var user = {
                email : req.body.email,
                password : req.body.passwd,
                first_name : req.body.firstname,
                last_name : req.body.lastname,
                created_at : new Date()
            }
            Users.create(user, function(err, post){
                if (err){
                    res.render("admin/signup", {data: {error: "Register failed !!"}})
                } else {
                    res.redirect("/admin/login")
                }
            })
        }  
    })
    app.get("/admin/login", function(req, res){
        res.render("admin/login",{data: {}})
    })
    app.post("/admin/login", function(req, res){
        var params = req.body;
        if (params.email.trim().length == 0 ){
            res.render("login", {data : {error : "Please enter your email !!"}});
        } else {
            Users.find( function(err, users){
               var check = false 
                for (var i =0; i < users.length; i++ ){
                   if (users[i].email == params.email && users[i].password == params.password){
                        check = true 
                   }
               }
               if ( check == true){
                for (var i =0; i < users.length; i++ ){
                    if (users[i].email == params.email){
                        req.session.user = users[i] ;
                        console.log(req.session.user)
                        res.redirect("/admin");
                    }
                }
               } else {
                res.render("admin/login", {data : {error : "Password not match !!"}});
               }
            })
        }
    })

}