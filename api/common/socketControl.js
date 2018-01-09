module.exports = function(io){
    var usernames = []
    io.sockets.on("connection", function(socket){
        console.log("Have a new user connection")
        //Listen add user evet
        socket.on("adduser", function(username){
            socket.username = username 
            usernames.push(username)
             //Notify to myself
        var data = {
            sender : "HoangAnhBKHN",
            message : "You have join Chat Room"
        }
        socket.emit("update_message", data)
        socket.emit("update_user", usernames)
        // Notify to other users
        var data = {
            sender : "HoangAnhBKHN",
            message :"<b>" + username + "</b> have join Chat Room"
        }
        socket.broadcast.emit("update_message", data)
        socket.broadcast.emit("update_user", usernames)
        })
        //Listen send message event
        socket.on("send_message", function(message){
            //Notify to my self
            var data = {
                sender : "You",
                message : message
            }
            socket.emit("update_message", data)

            //Notify to other user 
            var data = {
                sender : socket.username ,
                message : message
            }
            socket.broadcast.emit("update_message", data)
        })
        socket.on("disconnect", function(){
            //delete username
            for (var i = 0; i< usernames.length; i++){
                if (usernames[i] == socket.username){
                    usernames.splice(i,1)
                }
            }
            var data = {
                sender : "HoangAnhBKHN",
                message : "<b>"+ socket.username + " </b> : left Char Room"
            }
            socket.broadcast.emit("update_message", data)
            socket.broadcast.emit("update_user", usernames)
        })
    })
}