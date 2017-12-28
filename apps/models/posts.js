var q = require("q");
var db = require("../common/database");

var conn = db.getConnection();

function get_all_post() {
    var defer = q.defer();
    var query = conn.query('SELECT * FROM posts', function (error, posts) {
        if (error) {
            defer.reject(error);
        } else {
            defer.resolve(posts);
        }
    });
    return defer.promise;
}
function addPost(params) {
    if (params) {
        var defer = q.defer();
        var query = conn.query('INSERT INTO posts SET ?', params, function (error, results) {
            if (error) {
                defer.reject(error);
            } else {
                defer.resolve(results);
            }
        });
        return defer.promise;
    }
    return false;
}

function getPostById(id) {
    var defer = q.defer();
    var query = conn.query('SELECT * FROM posts WHERE ?', { id: id }, function (error, posts) {
        if (error) {
            defer.reject(error);
        } else {
            defer.resolve(posts);
        }
    });
    return defer.promise;
}
function updatePost(params) {
    if (params) {
        var defer = q.defer();
        var query = conn.query('UPDATE posts SET title = ?, content = ?, author = ?, updated_at = ? WHERE id = ?', [params.title, params.content, params.author, new Date(), params.id], function (error, results) {
            if (error) {
                defer.reject(error);
            } else {
                defer.resolve(results);
            }
        });
        return defer.promise;
    }
    return false;
}
function deletePost(id){
    if (id) {
        var defer = q.defer();
        var query = conn.query('DELETE FROM posts  WHERE id = ?', [ id], function (error, results) {
            if (error) {
                defer.reject(error);
            } else {
                defer.resolve(results);
            }
        });
        console.log(query.sql)
        return defer.promise;
    }
    return false;
}

module.exports = {
    get_all_post: get_all_post,
    addPost: addPost,
    getPostById: getPostById,
    updatePost: updatePost,
    deletePost : deletePost
}