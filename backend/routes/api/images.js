const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const {getAiPictures} = require('../../openAi');


router.post('/', async (req, res) => {
  try{
    const {chatbot} = req.body;
    const response = await getAiPictures(chatbot);
    return res.json({response});
  }catch(err){
    console.log(err);
    return res.status(500).json({err});
  }

});




module.exports = router;