const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const {getAiPrompts} = require('../../openAi');


router.post('/', async (req, res) => {
    try{
        const {prompt} = req.body;
        const response = await getAiPrompts(prompt);
        return res.json({response});
    } catch (err) {
        console.log(err)
    }
});

module.exports = router;