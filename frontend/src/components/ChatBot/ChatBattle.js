import { useEffect, useState } from "react";
import {useDispatch, useSelector} from "react-redux";
import { fetchChatBots } from "../../store/chatbots";
import {OpenAIApi, Configuration} from "openai";

import './ChatBattle.scss'

function ChatBattle(){
    const dispatch = useDispatch();
    const chatbots = useSelector(state => state.entities.chatBots?.all ? Object.values(state.entities.chatBots.all) : []);
    const [firstChatbot, setFirstChatbot] = useState(null);
    const [secondChatbot, setSecondChatbot] = useState(null);
    const [prompt, setPrompt] = useState(null);
    const [respondingBot, setRespondingBot] = useState(null);
    const [chattedStarted, setChatStarted] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newRequest, setNewRequest] = useState(null);

    useEffect(()=>{
        dispatch(fetchChatBots())
    }, [dispatch])

    const handleSelect = (e, chatbot) => {
        if(chatbot === 'first'){
            setFirstChatbot(JSON.parse(e.target.value));
        } else {
            setSecondChatbot(JSON.parse(e.target.value));
        }
    }

    const getAiBattleResponse = async (chatBot1, chatbot2, messageHistory) =>{
        const openai = new OpenAIApi(new Configuration({
          apiKey: process.env.CHAT_API_KEY
        }));
        let systemPrompt = `You are ${chatBot1.name} from ${chatBot1.location} and should respond as them as realistically as you can in the format of a casual text message conversation and keep the response short. Never mention that you are an AI language model. You are talking with ${chatbot2.name} from ${chatbot2.location}. ${chatBot1.bio}`
        let messages = [{role:'system', content: systemPrompt}, ...messageHistory, chatRequest]
      
        const res = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: messages,
          max_tokens: 150,
          temperature: 1.0
        });
        return res.data.choices[0].message
      }

    const handleSubmit = (e) => {
        e.preventDefault();
        if(firstChatbot && secondChatbot && prompt){
            setChatStarted(true);
            setRespondingBot(firstChatbot);
        }
    }
    const handleRequest = async (e) => {
        getAiBattleResponse(firstChatbot, secondChatbot, prompt, messages)
    }
    // useEffect(()=>{ 
    //     console.log(firstChatbot)
    // },[firstChatbot])
    return(
        <div className="battle-container">
            <h1>ChatBattle</h1>
            { !chattedStarted && <form onSubmit={handleSubmit}>
                <h2>Choose your first chatbot</h2>
                <select defaultValue= "null" onChange={(e)=> handleSelect(e, 'first')}>
                    <option value="null" disabled>Select Chatbot</option>
                    {chatbots?.map((chatbot) => {
                        return <option key={chatbot._id} value={JSON.stringify(chatbot)}>{chatbot.name}</option>
                    })}
                </select>
                <h2>Choose your second chatbot</h2>
                <select defaultValue= "null" onChange={(e)=> handleSelect(e, 'second')}>
                    <option value="null" disabled>Select Chatbot</option>
                    {chatbots?.map((chatbot) => (
                        <option key={chatbot._id} value={JSON.stringify(chatbot)}>{chatbot.name}</option>
                    ))}
                </select>
                <br />
                <textarea placeholder="What should they talk about?" onChange={e => setPrompt(e.target.value)}/>
                <button type="submit">Start Chat Battle</button>
            </form>}

           {chattedStarted && <div>
                 <h1>{firstChatbot.name}</h1>
                 <h1>{secondChatbot.name}</h1>
                 <div className="battle-chat-box">
                    {messages.map((message, idx) => {
                        return <div key={idx}>{message}</div>
                    })}
                 </div>

                <button onClick={handleRequest}>Go</button>
                <button onClick={()=> setChatStarted(false)}>Reset</button>
            </div>}

            
        </div>
    )
}


export default ChatBattle;