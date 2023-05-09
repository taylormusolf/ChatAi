const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {getAiResponse} = require('../../openAi');



// router.post('/', async (req, res) => {
//   try {
//     const data = await getAiResponse(req.body.chatRequest);
//     return res.json(data);
//   }
//   catch(err) {
//     return res.json('Could not return that request');
//   }
// });


module.exports = router;