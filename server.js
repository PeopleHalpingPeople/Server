'use strict'

const mongoose = require('mongoose');
const Chat = require('./chat-schema.js');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
const MONGODB_URI = process.env.MONGODB_URI;
const { Server } = require('socket.io');
const PORT = process.env.PORT || 3000;

let users = [];

mongoose.connect(MONGODB_URI, { useNewParser: true, useUnifiedTopology: true }).then(() => {
  console.log('mongoDB is connected');
}).catch(err => console.log(err));

const io = new Server(PORT, {cors: {origin: ['http://localhost:3001']}})

io.on('connection', (socket) => {
  console.log('connected')
  
  socket.on('add user', async (event) => {
    users.push(event); 
    const allMessages = await Chat.find({ });
    users[event] = event.socketID;
    socket.emit('message list', { currentUser: event, allMessages });
  });

  socket.on('message1',(event) => {
    const message = new Chat( event );
    message.save().then(() => {
      io.emit('message saved to db');
    })
    socket.emit('message', message);
  });

  socket.on('private message', (event) => {
    const message = new Chat( event );
    message.save().then(() => {
      io.emit('message saved to db');
      console.log('message saved to DB');
    })
    io.to(users[message.privateReceiver]).emit('private message', message);
    socket.emit('private message', message);
  });

  socket.on('disconnect', (event) => {
    console.log('user has left the chat');
    return event;
  });
});

