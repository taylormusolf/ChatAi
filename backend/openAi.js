const {OpenAIApi, Configuration} = require("openai");

const getAiResponse = async (messages) =>{
  const openai = new OpenAIApi(new Configuration({
    apiKey: process.env.CHAT_API_KEY
  }));

  const res = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: messages
  });
  return res.data.choices[0].message
}

const getAiPrompts = async (prompt) =>{
  console.log('prompt', prompt)
  const openai = new OpenAIApi(new Configuration({
    apiKey: process.env.CHAT_API_KEY
  }));
  let message = {role:'user', content: prompt};
  let newMessages = [{role:'system', content:'Provide a list of 5 prompts to ask subject provided. Return in an array with no numbering.'}, message];
  const res = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: newMessages,
    temperature: 0.9
  });
  return res.data.choices[0].message
}

const getAiPictures = async (prompt) =>{
  const openai = new OpenAIApi(new Configuration({
    apiKey: process.env.CHAT_API_KEY
  }));

  const res = await openai.createImage({
    prompt,
    n: 3,
    size: "1024x1024"
  });
  return res.data.choices[0].message
}




module.exports = {
  getAiResponse,
  getAiPrompts,
  getAiPictures
}