var mongoose = require("mongoose")

var config = require("./config")

module.exports = {
    getDbConnectionString : function (){
        return `mongodb://${config.username}:${config.password}@ds133127.mlab.com:33127/blog`
    }
}