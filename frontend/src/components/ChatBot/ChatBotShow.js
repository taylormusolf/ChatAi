import { useEffect, useState, useRef } from "react";
import {useDispatch, useSelector} from "react-redux";
import { fetchChatBot } from "../../store/chatbots";
import { fetchChatResponse, receiveChatRequest, clearChatResponse} from '../../store/chat';
import { fetchPrompts, clearPrompts } from "../../store/prompts";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import typingGif from "../../assets/typing-text.gif";
import { delay } from "../Util";
import { openModal } from "../../store/modal";
import loadingGif from "../../assets/loading.gif"
import { BsFillArrowLeftCircleFill } from 'react-icons/bs';
import {AiFillCloseCircle} from 'react-icons/ai';
import {BiSolidSend} from 'react-icons/bi';
import {SlOptions} from 'react-icons/sl';
import {TbError404} from 'react-icons/tb'

function ChatBotShow(){
  
  const dispatch = useDispatch();
  const {chatBotId} = useParams();
  const bot = useSelector(state => state.entities.chatBots?.new ? state.entities.chatBots.new: null  )
  const sessionUser = useSelector(state => state.session?.user);

  const [request, setRequest] = useState('');
  const [response, setResponse] = useState('');
  const [botLoaded, setBotLoaded] = useState(false);
  const [loadingResponse, setLoadingResponse] = useState(false); //shows message loading gif
  const [loadingChat, setLoadingChat] = useState(false); //disables chat until message finishes
  const [loadingPrompts, setLoadingPrompts] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showPrompts, setShowPrompts] = useState(false);

  const chat = useSelector(state => Object.keys(state.entities.chats).length === 0 ? {} : state.entities.chats.current);
  const newResponse = useSelector(state => state.entities.chats?.new);
  const prompts = useSelector(state => state.ui.prompts);
  const chatEndRef = useRef(null);
  
  const scrollToBottomChat = ()=>{
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(()=>{
    dispatch(clearPrompts())
    dispatch(fetchChatBot(chatBotId)).then(()=> setBotLoaded(true));
  }, [dispatch, chatBotId])

  useEffect(()=> { //this fixes bug if chatbot was edited mid conversation it wouldn't show their last response twice
    setResponse('');
    // dispatch(clearChatResponse())
  }, [bot])

  const generatePrompts = e => {  
    e.preventDefault();
    setLoadingPrompts(true);
    setShowPrompts(true);
    dispatch(clearPrompts());
    dispatch(fetchPrompts(chatBotId)).then(()=>setLoadingPrompts(false));
  }
  // const handlePromptRegen = (e) => {
    
  // }

  
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
    setLoadingChat(false)
  }

  useEffect(()=>{
    scrollToBottomChat();
  }, [chat, response])
  
  useEffect(()=>{
    setTimeout(scrollToBottomChat, 500) //had to add a delay so typing gif has time to load before the scroll occurs
  }, [loadingChat])
  
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
        setLoadingResponse(true);
        setShowMenu(false);
        dispatch(fetchChatResponse(chat._id, {role: 'user', content: prompt, name: sessionUser.username })).then(()=>setLoadingResponse(false));
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
      setLoadingChat(true); //disables user ability to send messages
      setLoadingResponse(true); //brings up the typing message gif
      dispatch(fetchChatResponse(chat._id, {role: 'user', content: request, name: sessionUser.username })).then(()=>setLoadingResponse(false));
    } catch (err) {
      console.log(err)
    }

  }

  const popup = ()=>{
    return (
    <div className="show-chat-popup-container">
      <div className="show-chat-popup">
        {!showPrompts && <div className="show-chat-popup-buttons">
          <div className="show-chat-popup-navigation">
            <h1>Chatbot Options Menu</h1>
            <div id="show-chat-popup-x" className="close-x" onClick={()=> setShowMenu(false)}><AiFillCloseCircle/></div>
          </div>
          {/* <Link to='/chatbots/'>Back to ChatBot Index</Link> */}
          <button className='popup-button' disabled={loadingPrompts} onClick={generatePrompts}>Generate Prompts</button>
          <button className='popup-button' onClick={()=> dispatch(openModal({name: 'clear history', fnc: setResponse}))}>Clear Chat History</button>
          { bot?.author?._id.toString() === sessionUser?._id.toString() || sessionUser?.username === 'admin' ? <button className='popup-button' onClick={()=> dispatch(openModal({name:'edit'}))}>Edit Bot</button> : null}
          { bot?.author?._id.toString() === sessionUser?._id.toString() || sessionUser?.username === 'admin' ? <button className='popup-button' onClick={()=> dispatch(openModal({name:'delete'}))}>Delete Bot</button> : null}
          <button className='popup-button' onClick={()=> setShowMenu(false) || dispatch(openModal({name: 'clone'}))}>Clone Bot</button>
        </div>}
        {showPrompts && <div className="prompt-menu-wrapper">
          <div className="show-chat-popup-navigation">
            <div className='back-button' onClick={()=>setShowPrompts(false)}><BsFillArrowLeftCircleFill /></div>
            <h1>Prompt Suggestions</h1>
            <div id="show-chat-popup-x" className="close-x" onClick={()=> setShowMenu(false)}><AiFillCloseCircle/></div>
          </div>
          {loadingPrompts ? <img className='prompt-loading-img' src={loadingGif} alt='loading gif'/> :
            <div className="prompt-suggestions-container">
              <ul className="prompt-suggestions" onClick={handlePromptClick}>
                {prompts?.response?.content.split('\n').map((prompt, i)=>{
                const modified = !Number.isNaN(parseInt(prompt[0])) ? prompt.slice(3) : prompt.slice(0,2) === '- ' ? prompt.slice(1) : prompt[0] === '-' ? prompt.slice(1) : prompt;
                return(
                  // <li key={i} className="prompt-entry"><strong><AiOutlineStar/></strong> {modified}</li>
                  <li key={i} className="prompt-entry">{modified}</li>
                  )
                })}
              </ul>
              <button className="prompt-suggestions-regen-button" onClick={generatePrompts}>Regenerate Prompts</button>  
            </div>
          }
          
        </div>}

          </div>
      </div>
      )
  }

  if(botLoaded && !bot){
    return(
      <div>
          <h1 id='message-404'>The chatbot you are looking for cannot be found.</h1>
            <div id='icon-404' ><TbError404 /></div>
      </div>
    )
  }

  return(
    <>
      <div className="chatbot-show-container">
              {/* <div className="chatbot-show-profile">
                <img className='chatbot-show-img' src={bot?.profileImageUrl} alt={bot?.name} />
                <h1>{bot?.name}</h1>
              </div> */}
            <ul className="chatbot-show-details">
              {/* {bot?.author.username && <h1 className="chat-header">Chat with {bot?.name}{bot?.author.username !== 'admin' ? ` (@${bot?.author.username})`: null}</h1>} */}
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
                        {mess.content.split('\n').map((message, i)=>{
                          return <h2 key={i}>{message}</h2>
                        })}
                        
                      </div>
                    ) 
                  })}
                  {response &&<div className="chatbot-show-response">
                     <div className='chatbot-show-message-detail'> 
                          <img className='chatbot-show-img-small' src={bot?.profileImageUrl} alt={bot?.name} />
                          <h1>{bot?.name} </h1>
                        </div>
                    { response && response.split('\n').map((message)=>{
                          return <h2>{message}</h2>
                        }) }
                  </div>}
                  {loadingResponse ? <img className='typing' src={typingGif} alt='gif'/> : null}
                  <div className='ref-div' ref={chatEndRef} />
                </ul>
              </div>
            </ul>
      </div>
      {bot?.name &&<div className='chatbot-show-message-form-container'>
        <form className="show-chat-form" onSubmit={handleSubmit}>
          <input type='text' className="show-chat-form-input" onChange={handleChange} value={request} placeholder={`Send a message to ${bot?.name}`}/>
          <button className='chat-form-button' disabled={loadingChat || !request.length}><BiSolidSend /></button>
        </form>
        <button className='chat-form-button' onClick={()=> showMenu ? setShowMenu(false) : setShowMenu(true)}><SlOptions/></button>
      </div>}
      {showMenu && popup()}
    </>
  )

}

export default ChatBotShow;