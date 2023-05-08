import {useEffect, useState, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import jwtFetch from '../../store/jwt';
import { fetchChatResponse, receiveChatRequest } from '../../store/chat';
import './Chat.scss'

function Chat(){
  const [request, setRequest] = useState('');
  const [response, setResponse] = useState('');
  const chat = useSelector(state => Object.keys(state.ui.chat).length === 0 ? [] : state.ui.chat)
  const dispatch = useDispatch();
  const chatEndRef = useRef(null);

  const scrollToBottomChat = ()=>{
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // const fetchChatResponse = async ()=> {
  //   try {
  //     const res = await jwtFetch ('/api/chatbot', {
  //       method: 'POST',
  //       body: JSON.stringify({chatRequest: request})
  //     });
  //     const chatResponse = await res.json();
  //     setResponse(chatResponse);
  //   } catch (err) {
  //     const resBody = await err.json();
  //     if (resBody.statusCode === 400) {
  //       setResponse(resBody.errors);
  //     }
  //   }
  // };

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
  <>
    <div className='chat-container'>
      <div className='chat-leo-container'>
        <img src='https://pet-network-seeds.s3.us-west-1.amazonaws.com/leo_on_couch.JPG' alt='leo' />
        <div className='chat-box'>
          <ul>
            {chat.map((mess, i)=>{
              return(
                <div key={i}>
                  <h1>{mess.role === 'assistant' ? 'Leo' : 'You'}</h1>
                  <h2>{mess.content}</h2>
                </div>
              ) 
            })}
            <div ref={chatEndRef} />
          </ul>
          
        </div>
        
      </div>
      <form onSubmit={handleSubmit}>
        <h1>Talk to Leo:</h1>
        <input onChange={handleChange} value={request}/>
        <input type='submit' value="Send"/>
      </form>
    </div>
  </>
 )



}

export default Chat;