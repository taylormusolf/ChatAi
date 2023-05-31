const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const {getAiBattleResponse} = require('../../openAi');


router.post('/', async (req, res) => {
  try{
    const {chatbot1, chatbot2, prompt, currentChatbot, messages} = req.body;
    const response = await getAiBattleResponse(chatbot1, chatbot2, prompt, currentChatbot, messages);
   
    return res.json(response);
  }catch(err){
    console.log(err);
    return res.status(500).json({err});
  }

});




module.exports = router;