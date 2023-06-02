const { json } = require("express");
const {OpenAIApi, Configuration} = require("openai");

const rules = [
  'You should respond as realistically as you can in the format of a casual text message conversation and keep the response short.', 
  'Never ever mention that you are an AI language model.'

]


const getAiResponse = async (chatBot, chat, chatRequest) =>{
  const openai = new OpenAIApi(new Configuration({
    apiKey: process.env.CHAT_API_KEY
  }));
  const from = chatBot.from ? `from ${chatBot.from}` : '';
  const prompt = chatBot.prompt ? `${chatBot.prompt}` : '';
  const description = chatBot.description ? `${chatBot.description}` : '';
  const greeting = chatBot.greeting ? {role:'assistant', content: chatBot.greeting} : {};
  let systemPrompt = `You are ${chatBot.name} ${from}.  The user you are speaking with is ${chatRequest.name}. ${rules.join(' ')} ${description}. ${prompt}.`
  let messages = [{role:'system', content: systemPrompt}, greeting, ...chat.messages, chatRequest]

  const res = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: messages,
    max_tokens: 150,
    temperature: 0.9
  });
  return res.data.choices[0].message
}

const getAiPrompts = async (chatbot) =>{
  const {name, prompt, from, description, greeting} = chatbot;
  const openai = new OpenAIApi(new Configuration({
    apiKey: process.env.CHAT_API_KEY
  }));
  const fromFormatted = chatbot.from ? `from ${chatbot.from}` : '';
  const descriptionFormatted = chatbot.description ? `${chatbot.description}` : '';

  const content = `The subject's name is ${name} ${fromFormatted}. ${descriptionFormatted}`;
  const message = {role:'user', content};
  const newMessages = [{role:'system', content:'Provide a non-numbered and list of 3 prompts to ask subject provided. Do not use numbering. The prompts should be formatted as if you are addressing the subject directly.'}, message];
  const res = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: newMessages,
    // temperature: 0.9
    temperature: 1

  });
  return res.data.choices[0].message
}

const getAiPictures = async (chatbot, userPrompt) =>{
  const {name, prompt, from, description, greeting} = chatbot;
  const openai = new OpenAIApi(new Configuration({
    apiKey: process.env.CHAT_API_KEY
  }));
  // const message = {role:'user', content: userPrompt};
  // const prompt = `Create a picture of ${name} from ${from}. ${prompt}`;

  const res = await openai.createImage({
    prompt: userPrompt,
    n: 1,
    size: "256x256"
  });

  return res.data;
}

const getAiBattleResponse = async (chatbot1, chatbot2, prompt, currentChatbot, messages) =>{
  
  let currMessages = messages;
  let otherChatbot = chatbot2;
  if(chatbot1._id !== currentChatbot._id){
      otherChatbot = chatbot1;
      currMessages.forEach((mess, i)=>{
          if(mess.role === 'assistant'){
              currMessages[i].role = 'user'
          } else if(mess.role === 'user'){
              currMessages[i].role = 'assistant'
          }
      })
  }
  try{
  const openai = new OpenAIApi(new Configuration({
    apiKey: process.env.CHAT_API_KEY
  }));
  const fromFormatted = currentChatbot.from ? `from ${currentChatbot.from}` : '';
  const fromFormatted2 = otherChatbot.from ? `from ${otherChatbot.from}` : '';



  let systemPrompt = `You are ${currentChatbot.name} ${fromFormatted}. ${rules.join(' ')} I am ${otherChatbot.name} ${fromFormatted2}. Talk to me about about: ${prompt}.`
  let messagesArr = [{role:'system', content: systemPrompt}, ...currMessages]

  const res = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: messagesArr,
    // max_tokens: 150,
    temperature: 1.0
  });
    return {content: res.data.choices[0].message.content, name: currentChatbot.name.split(" ")[0], role: chatbot1._id !== currentChatbot._id ? 'user' : 'assistant'}
  } catch(err){
    console.log(err.response.data)
  }
}




module.exports = {
  getAiResponse,
  getAiPrompts,
  getAiPictures,
  getAiBattleResponse
}