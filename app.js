const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = require('./server/router');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const path = require('path');
const http = require('http');
const server = http.createServer(app);
const socketIo = require('socket.io');
const io = new socketIo.Server(server);
const formatMessage = require('./server/utils/messages');
const {userJoin, getCurrentUser, userLeave, getRoomUsers, giveAllRooms, createRoom} = require('./server/utils/users');
//****End of imports****


const connection = () => {
    mongoose.connect('mongodb://localhost/DoctorsHelp', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log('Connected With Mongo DB');
};

connection();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: false}));

const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false 
}));

app.use(cookieParser());

app.use(express.static(path.resolve(__dirname, './public')));
const botName = 'Cody';

io.on('connection', socket => {
    console.log('a user connected');
    socket.on('joinRoom', ({
        username, room
    }) => {
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);
    //    welcome current user
        socket.emit('messageFromServer', formatMessage(botName, 'Welcome To ChatPRO'));
    //    broadcast when a user enters
        socket.broadcast
            .to(user.room)
            .emit('messageFromServer', formatMessage(botName, String(`${user.userName} has joined the room`)));

    //    send users and room info
        io
            .to(user.room)
            .emit('roomUser', {
                roomNameSent: String(user.room),
                users : getRoomUsers(user.room)
            })
    })

//    listen to chat messages
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('messageFromServer', formatMessage(user.userName, msg))
    })

    //message to notify user disconnection
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        if(user) {
            io.to(user.room).emit('messageFromServer', formatMessage(botName, `${user.userName} has left the room`));
            io.to(user.room).emit('roomUser', {roomNameSent : String(user.room), users : getRoomUsers(user.room)});
        }
    })
})

app.use('/', router);
//********* listening to port ********
server.listen(3000, () => {
    console.log('connecting to http://localhost:3000');
});