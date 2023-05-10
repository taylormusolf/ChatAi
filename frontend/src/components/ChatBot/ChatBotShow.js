import { useEffect, useState, useRef } from "react";
import {useDispatch, useSelector} from "react-redux";
import { fetchChatBot } from "../../store/chatbots";
import { fetchChatResponse, receiveChatRequest } from '../../store/chat';
import {Link} from "react-router-dom";
import './ChatBotShow.scss'
import { useParams } from "react-router-dom/cjs/react-router-dom.min";

function ChatBotShow(){
  
  const dispatch = useDispatch();
  const {chatBotId} = useParams();
  const bot = useSelector(state => state.entities.chatBots?.new ? state.entities.chatBots.new.chatbot : {}  )

  const [request, setRequest] = useState('');
  const chat = useSelector(state => Object.keys(state.ui.chat).length === 0 ? [] : state.ui.chat)
  const chatEndRef = useRef(null);
  
  const scrollToBottomChat = ()=>{
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(()=>{
    dispatch(fetchChatBot(chatBotId))
  }, [dispatch, chatBotId])

  useEffect(()=>{
    scrollToBottomChat();
  }, [chat])

  const handleChange = (e) => {
    setRequest(e.target.value);
  }

  const handleSubmit = async(e)=>{
    e.preventDefault();
    try {
      dispatch(receiveChatRequest(request))
      setRequest("");
      const chatRequest = [...chat, {role: 'user', content: request }]
      dispatch(fetchChatResponse(chatRequest));
    } catch (err) {
      console.log(err)
    }

  }


  return(
    <div className="chatbot-show-container">
        
          <ul className="chatbot-show-details">
            <li>{bot?.name}</li>
            <img src={bot?.profileImageUrl} alt={bot?.name}/>
            <div className='chatbot-show-box'>
              <ul>
                {chat.map((mess, i)=>{
                  return(
                    <div key={i}>
                      <h1>{mess.role === 'assistant' ? bot?.name : 'You'}</h1>
                      <h2>{mess.content}</h2>
                    </div>
                  ) 
                })}
                <div ref={chatEndRef} />
              </ul>
              
            </div>
          </ul>
          <form onSubmit={handleSubmit}>
            <h1>Talk to {bot?.name}:</h1>
            <input onChange={handleChange} value={request}/>
            <input type='submit' value="Send"/>
          </form>
          

            <Link to='/chatbots/'>Back to ChatBot Index</Link>
    </div>
  )

}

export default ChatBotShow;