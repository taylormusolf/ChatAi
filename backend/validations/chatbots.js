const { check } = require("express-validator");
const handleValidationErrors = require('./handleValidationErrors');



const validateChatbot = [
    check('name')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a name for your chatbot.'),
    check('greeting')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a greeting for your chatbot.'),
        handleValidationErrors
];

module.exports = validateChatbot;