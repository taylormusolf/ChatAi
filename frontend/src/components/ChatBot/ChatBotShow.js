import { useEffect, useState, useRef } from "react";
import {useDispatch, useSelector} from "react-redux";
import { fetchChatBot } from "../../store/chatbots";
import { fetchChatResponse, receiveChatRequest, createChat, deleteChat } from '../../store/chat';
import { fetchPrompts, clearPrompts } from "../../store/prompts";
import {Link} from "react-router-dom";
import './ChatBotShow.scss'
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import typingGif from "../../assets/typing-text.gif"


function ChatBotShow(){
  
  const dispatch = useDispatch();
  const {chatBotId} = useParams();
  const bot = useSelector(state => state.entities.chatBots?.new ? state.entities.chatBots.new: {}  )

  const [request, setRequest] = useState('');
  const [loadingChat, setLoadingChat] = useState(false);
  const [loadingPrompts, setLoadingPrompts] = useState(true);

  const chat = useSelector(state => Object.keys(state.entities.chats).length === 0 ? {} : state.entities.chats.current);
  const prompts = useSelector(state => state.ui.prompts.response?.content.split('\n'));
  const chatEndRef = useRef(null);
  
  const scrollToBottomChat = ()=>{
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(()=>{
    dispatch(clearPrompts())
    dispatch(fetchChatBot(chatBotId))
  }, [dispatch, chatBotId])

  useEffect(()=>{ 
    dispatch(fetchPrompts(chatBotId)).then(()=>setLoadingPrompts(false));
  }, [dispatch, chatBotId]);


  const clearHistory = chatId => e => {
    e.preventDefault();
    dispatch(deleteChat(chatId))
    dispatch(createChat({chatBotId}))
  }

  const regeneratePrompts = e => {  
    e.preventDefault();
    setLoadingPrompts(true);
    dispatch(fetchPrompts(chatBotId)).then(()=>setLoadingPrompts(false));
  }

  const handlePromptClick = (e) => {
    e.preventDefault();
    if(!loadingChat){
      setRequest(e.target.innerText.slice(3))
    }
  }

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
      setLoadingChat(true);
      dispatch(fetchChatResponse(chat._id, {role: 'user', content: request })).then(()=>setLoadingChat(false));
      
    } catch (err) {
      console.log(err)
    }

  }

  return(
    <div className="chatbot-show-container">
        
          <ul className="chatbot-show-details">
            <div className="chatbot-show-profile">
              <img className='chatbot-show-img' src={bot?.profileImageUrl} alt={bot?.name}/>
              <li>{bot?.name}</li>
              
            </div>
            <div className='chatbot-show-box'>
              <ul>
                {chat?.messages?.map((mess, i)=>{
                  return(
                    <div key={i}>
                      <h1 >{mess.role === 'assistant' ? bot?.name : 'You'}</h1>
                      <h2>{mess.content}</h2>
                    </div>
                  ) 
                })}
                {loadingChat ? <img className='typing' src={typingGif} alt='gif'/> : null}
                <div ref={chatEndRef} />
              </ul>
              
            </div>
          </ul>
          <div className="show-chat-right-panel">
            <form onSubmit={handleSubmit}>
              <h1>Talk to {bot?.name}:</h1>
              <input onChange={handleChange} value={request}/>
              <input type='submit' value="Send" disabled={loadingChat}/>
            </form>
            <h1>Prompt Suggestions:</h1>
            <ul className="prompt-suggestions" onClick={handlePromptClick}>
              {loadingPrompts ? <h1>Loading...</h1> : null}
              {prompts?.map((prompt, i)=>{
                return(
                  <li key={i}>{prompt}</li>
                )
              })}
            </ul>
            <button onClick={regeneratePrompts}>Regenerate Prompts</button>
            <button onClick={clearHistory(chat?._id)}>Clear Chat History</button>
            <Link to='/chatbots/'>Back to ChatBot Index</Link>
          </div>
             
    </div>
  )

}

export default ChatBotShow;