'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const chatSchema = new Schema ({
  User_Message: {
    type: String
  },
  username: {
    type: String
  },
  privateReceiver: {
    type: String
  },
});

let Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;