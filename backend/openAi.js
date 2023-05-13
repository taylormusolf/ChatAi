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

const getAiPrompts = async (chatbot) =>{
  const {name, bio, location} = chatbot;
  const openai = new OpenAIApi(new Configuration({
    apiKey: process.env.CHAT_API_KEY
  }));
  const prompt = `The subject's name is ${name} from ${location}. ${bio}`;
  const message = {role:'user', content: prompt};
  const newMessages = [{role:'system', content:'Provide a non-numbered and list of 3 prompts to ask subject provided. Do not use numbering.'}, message];
  const res = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: newMessages,
    temperature: 0.9
  });
  return res.data.choices[0].message
}

const getAiPictures = async (chatbot, userPrompt) =>{
  const {name, bio, location} = chatbot;
  const openai = new OpenAIApi(new Configuration({
    apiKey: process.env.CHAT_API_KEY
  }));
  // const message = {role:'user', content: userPrompt};
  // const prompt = `Create a picture of ${name} from ${location}. ${bio}`;

  const res = await openai.createImage({
    prompt: userPrompt,
    n: 1,
    size: "256x256"
  });

  return res.data;
}




module.exports = {
  getAiResponse,
  getAiPrompts,
  getAiPictures
}