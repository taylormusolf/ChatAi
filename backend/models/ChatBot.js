const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatBotSchema = Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  name: {
    type: String,
    required: true
  },
  profileImageUrl: {
    type: String,
    required: false
  },
  description: {
    type: String,
    required: false
  },
  prompt: {
    type: String,
    required: false
  },
  from: {
    type: String,
    required: false
  },
  greeting: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});


module.exports = mongoose.model('ChatBot', chatBotSchema);