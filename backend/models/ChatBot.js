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
  bio: {
    type: String,
    required: false
  },
  location: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});


module.exports = mongoose.model('ChatBot', chatBotSchema);