// emit ==> (',,,' , mail)  send a data to work with it there
// on ==> ('...', mail) get a data to work with it here
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);
require ("dotenv").config();
const path = require("path");
// const formatMessage = require('./utils/messages');
const moment = require('moment');

const users = {};

const socketToRoom = {};


io.on('connection', socket => {
    socket.on("join room", (roomID, name) => {
        if (users[roomID]) {
            console.log(roomID, name)
            // const length = users[roomID].length;
            // if (length === 4) {
            //     socket.emit("room full");
            //     return console.log('room full')
            // }
            users[roomID].push({socketID:socket.id, username:name});
        } else {
            users[roomID] = [{socketID:socket.id, username:name}];
        }
        socketToRoom[socket.id] = {roomID:roomID, username:name};
        const usersInThisRoom = users[roomID].filter(user => user.socketID !== socket.id);
        socket.emit("all users", usersInThisRoom);
    });

    socket.on("sending signal", payload => {
        io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerName: payload.callerName, callerID: payload.callerID });
    });

    socket.on("returning signal", payload => {
        io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
    });

    socket.on('disconnect', () => {
        const roomID = socketToRoom[socket.id]?.roomID;
        let room = users[roomID];
        if (room) {
            room = room.filter(id => id.socketID !== socket.id);
            users[roomID] = room;
        }
        socket.broadcast.emit('user left',socket.id)
    });


    socket.on('change', (payload) => {
        socket.broadcast.emit('change',payload)
    });

    socket.on('chat', (payload) => {
        io.emit('chat_message', {username:payload.name, msg:payload.chat_text, time: moment().format('hh:mm A')
  })
        // console.log(formatMessage(username, msg))
    });

});

if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const port = process.env.PORT || 8001
server.listen(port, () => console.log('server is running...'));


