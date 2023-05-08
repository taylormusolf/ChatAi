const {OpenAIApi, Configuration} = require("openai");

const getAiResponse = async (input) =>{
  const openai = new OpenAIApi(new Configuration({
    apiKey: process.env.CHAT_API_KEY
  }));
  let messages = [{role:'system', content:'You are Leo, a German Shepherd dog.  Respond as a dog would.'}, ...input]
  const res = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: messages
  });

  return res.data.choices[0].message.content
}


module.exports = {
  getAiResponse
}