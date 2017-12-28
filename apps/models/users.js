var q = require("q");
var db = require("../common/database");

var conn = db.getConnection();
function addUser(user){
    if(user){
        var defer = q.defer() ;
        var query = conn.query('INSERT INTO users SET ?', user, function (error, results) {
            if (error){
                    defer.reject(error);
            }else{
                defer.resolve(results);
            }
          });
        return defer.promise;
    }
    return false ;
}


function getUserByEmail(email){
    if (email){
        var defer = q.defer()
        var query = conn.query('SELECT * FROM users WHERE ?', {email: email}, function(err, results){
            if (err)
            {
                defer.reject(err);
            } else{
                defer.resolve(results);
            }
        });
        return defer.promise;
    }
    return false ;
}
function getAllUser(){
    var defer = q.defer()
    var query = conn.query('SELECT * FROM users ', function(err, results){
        if (err)
        {
            defer.reject(err);
        } else{
            defer.resolve(results);
        }
    });
    return defer.promise;
}

module.exports = {
    addUser : addUser,
    getUserByEmail : getUserByEmail,
    getAllUser : getAllUser
}