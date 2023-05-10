const {OpenAIApi, Configuration} = require("openai");

const getAiResponse = async (messages) =>{
  const openai = new OpenAIApi(new Configuration({
    apiKey: process.env.CHAT_API_KEY
  }));
  // let messages2 = [{role:'system', content:'You are Scooby Doo and should respond as him.'}, messages]

  const res = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: messages
  });
  return res.data.choices[0].message
}


module.exports = {
  getAiResponse
}