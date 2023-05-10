const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ChatBot = mongoose.model('ChatBot');
const Chat = mongoose.model('Chat');
const {getAiResponse} = require('../../openAi');
const { requireUser } = require('../../config/passport');


router.post('/', requireUser, async (req, res) => {
  const chatBot = await ChatBot.findOne({_id: req.body.chatBotId})
  let newChat;
  try {
    // if(chatBot){
      newChat = new Chat ({
        author: req.user,
    chatBot: chatBot,
    messages: []
  })
}catch(err){
  const error = new Error('Chatbot not found');
  error.statusCode = 404;
  error.errors = { message: "No chatbot found with that id" };
  return next(error);
}
try{
    let messages = [{role:'system', content:`You are ${chatBot.name} from ${chatBot.location} and should respond as them. ${chatBot.bio}`}, req.body.chatRequest]
    const data = await getAiResponse(messages);
    // console.log(data)
    newChat.messages = [...req.body.chatRequest, data]
    const chat = newChat.save();
    return res.json(chat);
  }catch(err) {
    return res.json('Could not return that request');
  }
});

router.patch('/', async (req, res) => {
  try {
    const data = await getAiResponse(req.body.chatRequest);
    return res.json(data);
  }
  catch(err) {
    console.log(err)
    return res.json('Could not return that request');
  }
});

router.delete('/', async (req, res) => {
  try {
    const data = await getAiResponse(req.body.chatRequest);
    return res.json(data);
  }
  catch(err) {
    return res.json('Could not return that request');
  }
});




module.exports = router;