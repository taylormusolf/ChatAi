const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ChatBot = mongoose.model('ChatBot');
const Chat = mongoose.model('Chat');
const { requireUser } = require('../../config/passport');
const { singleFileUpload, singleMulterUpload, retrievePrivateFile } = require("../../awsS3");


//gets all chatBots for index page
router.get('/', async (req, res) => {
  try {
    const bots = await ChatBot.find()
                  .populate("author", "_id username")
    return res.json(bots);
  }
  catch(err) {
    return res.json([]);
  }
});

//gets chatBot and the signedIn user's messages with that bot
router.get('/:id', async (req, res, next) => {
  let chatbot = null;
  try {
    chatbot = await ChatBot.findById(req.params.id)
                    .populate("author", "_id username")
  } catch(err) {
    const error = new Error('Chatbot not found');
    error.statusCode = 404;
    error.errors = { message: "No chatbot found with that id" };
    return next(error);
  }
  try {
    const chat = await Chat.find({ chatbot: chatbot._id, author: req.user})
    return res.json({chat, chatbot})
  } catch(err){
    return res.json([]);
  }
  
});

//create new chatbot
router.post('/', singleMulterUpload("image"),  requireUser, async (req, res, next) => {
  const profileImageUrl = req.file ?
      await singleFileUpload({ file: req.file, public: false}) :
      'https://pet-network-seeds.s3.us-west-1.amazonaws.com/leo_on_couch.JPG';
  try{
    const newChatBot = new ChatBot({
      name: req.body.name,
      profileImageUrl,
      bio: req.body.bio,
      location: req.body.location,
      author: req.user
    });
    let chatBot = await newChatBot.save();
    chatBot = await chatBot.populate("author", "_id username profileImageUrl")
    return res.json(newChatBot);

  }catch(err) {
    next(err);
  }
});

router.patch('/:id', singleMulterUpload("image"), requireUser, async (req, res, next) => {
  let chatbot = await ChatBot.find({ _id: req.params.id, author: {_id: req.user._id}})
  if(!chatbot) {
    const err = new Error("Validation Error");
    err.statusCode = 400;
    const errors = {};
    err.errors = errors;
    errors.userId = "You are not the owner of this Chatbot";
    return next(err);
  }
  req.file ?
      chatbot.profileImageUrl = await singleFileUpload({ file: req.file, public: false}) :
      chatbot.profileImageUrl;
  try{
    chatbot.name = req.body.name || chatbot.name;
    chatbot.bio = req.body.bio || chatbot.bio;
    chatbot.location = req.body.location || chatbot.location;
    await chatbot.save();
    chatbot = await chatbot.populate("author", "_id username profileImageUrl")
    return res.json(chatbot);

  }catch(err) {
    next(err);
  }
});

router.delete('/:id',  requireUser, async (req, res, next) => {
  const chatbot = await ChatBot.find({ _id: req.params.id, author: {_id: req.user._id}})
  if(!chatbot) {
    const err = new Error("Validation Error");
    err.statusCode = 400;
    const errors = {};
    err.errors = errors;
    errors.userId = "You are not the owner of this Chatbot";
    return next(err);
  }

  try{
    await ChatBot.deleteOne({_id: req.params.id})
    return res.json('Successfully Deleted')
  }catch(err) {
    next(err);
  }
});



module.exports = router;