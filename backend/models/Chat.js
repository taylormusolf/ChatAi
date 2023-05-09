const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  chatBot: {
    type: Schema.Types.ObjectId,
    ref: 'ChatBot'
  },
  
  messages: {
    type: [Object],
    required: true
  },
}, {
  timestamps: true
});

// const messageSchema = Schema({

// })

module.exports = mongoose.model('Chat', chatSchema);