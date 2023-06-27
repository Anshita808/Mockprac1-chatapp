// modules
const express = require("express")
const socketio = require("socket.io")
const http = require("http")
const app = express()

// function
const { userJoin, getRoomUsers, getcrnUsers, userLeave } = require("../utils/users")
const formateMessage = require("../utils/messages")

//server connection 
const server = http.createServer(app)
const io = socketio(server)

const messages = {
    NXM201:[],
    NXM101:[],
    DSA501:[],
    CSBT:[]
};

const boatName = "Masai Server";

io.on("connection", (socket) => {

    console.log("one client joined")

    socket.on("joinRoom", ({ username, room }) => {


        const user = userJoin(socket.id, username, room)

        socket.join(user.room);
         // history
        socket.emit("history",messages[user.room])

        // Welcome current 
        let formate = formateMessage(boatName, "Welcome to Masai Server");

        // messages[user.room].push(formate);

        socket.emit("message",formate )

        formate = formateMessage(boatName, `${user.username} has joined the chat`);

        messages[user.room].push(formate)
        // broadcat to other users
        socket.broadcast.to(user.room).emit("message", formate )

        //  Get all room user
        io.to(user.room).emit("roomUsers", {
            room: user.room, users: getRoomUsers(user.room)
        })

    })


    socket.on("chatMessage",(msg)=>{
          const user = getcrnUsers(socket.id)

          let formate = formateMessage(user.username,msg);
          messages[user.room].push(formate);
          io.to(user.room).emit("message",formate)
    });


    socket.on("disconnect",()=>{
        
        const user = userLeave(socket.id)

        let formate = formateMessage(boatName,`${user.username} has left the chat`)

                  messages[user.room].push(formate)
                  
        io.to(user.room).emit("message",formate)

          //  Get all room user
          io.to(user.room).emit("roomUsers", {
            room: user.room, users: getRoomUsers(user.room)
        })

    })

});






module.exports = io;
