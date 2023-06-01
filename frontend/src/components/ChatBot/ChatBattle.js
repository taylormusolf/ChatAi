import { useEffect, useState } from "react";
import {useDispatch, useSelector} from "react-redux";
import { fetchChatBots } from "../../store/chatbots";
import { fetchBattleResponse, clearBattleResponse } from "../../store/battle";

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
    const responses = useSelector(state => state.ui.battle);

    useEffect(()=>{
        dispatch(fetchChatBots())
    }, [dispatch])

    useEffect(()=>{
        if(responses){
            setMessages([...responses])
            setRespondingBot(respondingBot === firstChatbot ? secondChatbot : firstChatbot);
        }
    }, [responses])

    const handleSelect = (e, chatbot) => {
        if(chatbot === 'first'){
            setFirstChatbot(JSON.parse(e.target.value));
        } else {
            setSecondChatbot(JSON.parse(e.target.value));
        }
    }

    
    const handleSubmit = (e) => {
        e.preventDefault();
        if(firstChatbot && secondChatbot && prompt){
            setChatStarted(true);
            setRespondingBot(firstChatbot);
            
        }
    }
    const handleReset = (e) => {
        e.preventDefault();
        setChatStarted(false);
        setFirstChatbot(null);
        setSecondChatbot(null);
        setPrompt(null);
        setRespondingBot(null);
        setMessages([]);
        dispatch(clearBattleResponse())
    }
    const handleRequest = async (e) => {
        e.preventDefault();
        
        dispatch(fetchBattleResponse(firstChatbot, secondChatbot, prompt, respondingBot, messages))

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
                 <h1>{firstChatbot.name} vs {secondChatbot.name}</h1>
                <h2>Topic: {prompt}</h2>
                 <div className="battle-chat-box">
                    {responses?.map((message, idx) => {
                        const bot = message.role === 'assistant' ? firstChatbot : secondChatbot;
                        return (
                        <div key={idx} className="battle-bot-message">
                            <div>{bot.name}</div> 
                            <img src={bot.profileImageUrl} alt={bot.name}/>
                            <div>{message.content}</div>
                        </div>
                        )
                    })}
                 </div>

                <button onClick={handleRequest}>Go</button>
                <button onClick={handleReset}>Reset</button>
            </div>}

            
        </div>
    )
}


export default ChatBattle;