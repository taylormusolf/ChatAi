const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ChatBot = mongoose.model('ChatBot');
const Chat = mongoose.model('Chat');
const {getAiResponse} = require('../../openAi');
const { requireUser } = require('../../config/passport');



router.get('/:id', async (req, res, next) => {
  let chat = null;
  try {
    chat = await Chat.findById(req.params.id)
    return res.json(chat)
  } catch(err) {
    const error = new Error('Chat not found');
    error.statusCode = 404;
    error.errors = { message: "No chat found with that id" };
    return next(error);
  }
  
});


//get all chats
// router.get('/', async (req, res, next) => {
//   try {
//     const chat = await Chat.find()
//     return res.json(chat)
//   } catch(err) {
//     const error = new Error('Chat not found');
//     error.statusCode = 404;
//     error.errors = { message: "No chat found with that id" };
//     return next(error);
//   }
  
// });

//get all chatbots that current use has chatted with
router.get('/', requireUser, async (req, res, next) => {
  try {
    const chat = await Chat.find({author: req.user})
                  .populate('chatBot, _id name')
    return res.json(chat)
  } catch(err) {
    const error = new Error('Chat not found');
    error.statusCode = 404;
    error.errors = { message: "No chat found with that id" };
    return next(error);
  }
  
});

router.post('/', requireUser, async (req, res) => {
  const chatBot = await ChatBot.findOne({_id: req.body.chatBotId})
  // let newChat;
  try {
    // if(chatBot){
      const newChat = new Chat ({
        author: req.user,
    chatBot: chatBot,
    messages: []
  });

  const chat = await newChat.save();
  return res.json(chat);

}catch(err){
  const error = new Error('Chatbot not found');
  error.statusCode = 404;
  error.errors = { message: "No chatbot found with that id" };
  return next(error);
}
  // try{
  //   let messages = [{role:'system', content:`You are ${chatBot.name} from ${chatBot.location} and should respond as them. ${chatBot.bio}`}, req.body.chatRequest]
  //   const data = await getAiResponse(messages);
  //   newChat.messages = [req.body.chatRequest, data]
  //   const chat = await newChat.save();

  //   return res.json(chat);
  // }catch(err) {
  //   return res.json('Could not return that request');
  // }
});

router.patch('/:id', requireUser, async (req, res) => {
  const chat = await Chat.findOne({ _id: req.params.id, author: {_id: req.user._id}})
                  .populate("chatBot", "_id name")
  const chatBot = await ChatBot.findOne({_id: chat.chatBot._id})
  try{
    let messages = [{role:'system', content:`You are ${chatBot.name} from ${chatBot.location} and should respond as them. ${chatBot.bio}`}, ...chat.messages, req.body.chatRequest]
    const data = await getAiResponse(messages);
    chat.messages = [...chat.messages, req.body.chatRequest, data]
    const updatedChat = await chat.save();

    return res.json(updatedChat);
  }catch(err) {
    return res.json('Could not return that request');
  }
});

router.delete('/:id', requireUser, async (req, res) => {
  const chat = await Chat.findOne({ _id: req.params.id, author: {_id: req.user._id}})
  if(!chat) {
    const err = new Error("Validation Error");
    err.statusCode = 400;
    const errors = {};
    err.errors = errors;
    errors.userId = "You are not the owner of this Chat";
    return next(err);
  }

  try{
    await Chat.deleteOne({_id: req.params.id})
    return res.json('Successfully Deleted')
  }catch(err) {
    next(err);
  }
});




module.exports = router;