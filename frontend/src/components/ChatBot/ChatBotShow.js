import { useEffect, useState, useRef } from "react";
import {useDispatch, useSelector} from "react-redux";
import { fetchChatBot } from "../../store/chatbots";
import { fetchChatResponse, receiveChatRequest} from '../../store/chat';
import { fetchPrompts, clearPrompts } from "../../store/prompts";
import {Link} from "react-router-dom";
import './ChatBotShow.scss'
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import typingGif from "../../assets/typing-text.gif";
import { delay } from "../Util";
import { openModal } from "../../store/modal";


function ChatBotShow(){
  
  const dispatch = useDispatch();
  const {chatBotId} = useParams();
  const bot = useSelector(state => state.entities.chatBots?.new ? state.entities.chatBots.new: null  )
  const sessionUser = useSelector(state => state.session?.user);

  const [request, setRequest] = useState('');
  const [response, setResponse] = useState('');
  const [loadingChat, setLoadingChat] = useState(false);
  const [loadingPrompts, setLoadingPrompts] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const chat = useSelector(state => Object.keys(state.entities.chats).length === 0 ? {} : state.entities.chats.current);
  const newResponse = useSelector(state => state.entities.chats?.new);
  const prompts = useSelector(state => state.ui.prompts.response?.content.split('\n'));
  const chatEndRef = useRef(null);
  
  const scrollToBottomChat = ()=>{
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(()=>{
    dispatch(clearPrompts())
    dispatch(fetchChatBot(chatBotId))
  }, [dispatch, chatBotId])

  const generatePrompts = e => {  
    e.preventDefault();
    setLoadingPrompts(true);
    dispatch(clearPrompts());
    dispatch(fetchPrompts(chatBotId)).then(()=>setLoadingPrompts(false));
  }

  
  useEffect(()=>{
    if(newResponse){
      delayTypeResponse();
    }
  }, [newResponse]);
  

  const delayTypeResponse = async() => {
    // let lastChat = chat.messages[chat?.messages.length - 1]?.content.split('');
    let newChat = newResponse?.content.split('');
    for (let i = 0; i < newChat?.length; i++) {
      await delay(30)
      setResponse(newChat.slice(0,i+1).join(''))
    }
    
  }
  
  useEffect(()=>{
    scrollToBottomChat();
  }, [chat, response,  loadingChat])
  
  const handleChange = (e) => {
    setRequest(e.target.value);
  }
  
  const handlePromptClick = (e) => {
    e.preventDefault();
    if(!loadingChat){
      try {
        const prompt = e.target.innerText;
        dispatch(receiveChatRequest(prompt));
        setResponse("");
        setLoadingChat(true);
        dispatch(fetchChatResponse(chat._id, {role: 'user', content: prompt })).then(()=>setLoadingChat(false));
      } catch (err) {
        console.log(err)
      }

    }
  }
  const handleSubmit = async(e)=>{
    e.preventDefault();
    try {
      dispatch(receiveChatRequest(request))
      setRequest("");
      setResponse("");
      setLoadingChat(true);
      dispatch(fetchChatResponse(chat._id, {role: 'user', content: request })).then(()=>setLoadingChat(false));
    } catch (err) {
      console.log(err)
    }

  }

  const popup = ()=>{
    return <div className="show-chat-popup">
            <Link to='/chatbots/'>Back to ChatBot Index</Link>
            <button onClick={()=> dispatch(openModal({name: 'clear history', fnc: setResponse}))}>Clear Chat History</button>
            { bot?.author?._id.toString() === sessionUser?._id.toString() || sessionUser?.username === 'admin' ? <button onClick={()=> dispatch(openModal({name:'edit'}))}>Edit Bot</button> : null}
            { bot?.author?._id.toString() === sessionUser?._id.toString() || sessionUser?.username === 'admin' ? <button onClick={()=> dispatch(openModal({name:'delete'}))}>Delete Bot</button> : null}
            <button onClick={()=> dispatch(openModal({name: 'clone'}))}>Clone Bot</button>
            <button disabled={loadingPrompts} onClick={generatePrompts}>Generate Prompts</button>
            <ul className="prompt-suggestions" onClick={handlePromptClick}>
              {loadingPrompts ? <h1>Loading...</h1> : null}
              {prompts?.map((prompt, i)=>{
                const modified = !Number.isNaN(parseInt(prompt[0])) ? prompt.slice(3) : prompt.slice(0,2) === '- ' ? prompt.slice(1) : prompt[0] === '-' ? prompt.slice(1) : prompt;
                return(
                  <li key={i}>{modified}</li>
                )
              })}
            </ul>
          </div>
  }


  return(
    <div className="chatbot-show-container">
            {/* <div className="chatbot-show-profile">
              <img className='chatbot-show-img' src={bot?.profileImageUrl} alt={bot?.name} />
              <h1>{bot?.name}</h1>
            </div> */}
          <ul className="chatbot-show-details">
            <div className='chatbot-show-box'>
              <ul>
                  {bot?.greeting && <div>
                    <div className='chatbot-show-message-detail'> 
                      <img className='chatbot-show-img-small' src={bot?.profileImageUrl} alt={bot?.name} />
                      <h1>{bot?.name} </h1>
                    </div>
                    <h2>{bot.greeting}</h2>
                  </div>
                  }
                {chat?.messages?.map((mess, i)=>{
                   
                  return(
                    <div key={i}>
                      {mess.role === 'assistant' 
                      ? 
                      <div className='chatbot-show-message-detail'> 
                        <img className='chatbot-show-img-small' src={bot?.profileImageUrl} alt={bot?.name} />
                        <h1>{bot?.name} </h1>
                      </div>
                      : 
                      <div className='chatbot-show-message-detail'> 
                        <img className='chatbot-show-img-small' src={sessionUser?.profileImageUrl} alt={sessionUser?.name} />
                        <h1>{sessionUser?.username} </h1>
                      </div>
                      }
                      <h2>{mess.content}</h2>
                    </div>
                  ) 
                })}
                <div>
                  {response && <div className='chatbot-show-message-detail'> 
                        <img className='chatbot-show-img-small' src={bot?.profileImageUrl} alt={bot?.name} />
                        <h1>{bot?.name} </h1>
                      </div>}
                  { response && <h2>{response}</h2> }
                </div>
                {loadingChat ? <img className='typing' src={typingGif} alt='gif'/> : null}
                <br/>
                <div ref={chatEndRef} />
              </ul>
            </div>
            <div className='chatbot-show-message-form-container'>
              <form className="show-chat-form" onSubmit={handleSubmit}>
                <input type='text' onChange={handleChange} value={request} placeholder={`Send a message to ${bot?.name}`}/>
                <input type='submit' value="Send" disabled={loadingChat}/>
              </form>
              <button onClick={()=> showMenu ? setShowMenu(false) : setShowMenu(true)}>...</button>
            </div>
          </ul>
          {showMenu && popup()}
             
    </div>
  )

}

export default ChatBotShow;