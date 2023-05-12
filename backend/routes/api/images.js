const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const {getAiPictures} = require('../../openAi');


router.post('/', async (req, res) => {
  const {prompt} = req.body;
  const response = await getAiPictures(prompt);
  return res.json({response});

});




module.exports = router;