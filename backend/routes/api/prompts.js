const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ChatBot = mongoose.model('ChatBot');

const {getAiPrompts} = require('../../openAi');


router.post('/', async (req, res) => {
    try{
        const bot = await ChatBot.findOne({ _id: req.body.chatbotId })
        const response = await getAiPrompts(bot);
        return res.json({response});
    } catch (err) {
        console.log(err)
    }
});

module.exports = router;