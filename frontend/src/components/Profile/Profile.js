import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserChatBots, deleteChatBot, fetchChatBots } from '../../store/chatbots';
import { createChat } from "../../store/chat";
import {Link , useHistory} from "react-router-dom";
import { openModal } from '../../store/modal';

function Profile () {
  const dispatch = useDispatch();
  const history = useHistory();
  const currentUser = useSelector(state => state.session.user);
  const chatBots = useSelector(state => state.entities.chatBots.all ?  state.entities.chatBots.all : {}  )
  const userChatBots = useSelector(state => state.entities.chatBots.user);
  const chatted = useSelector(state => state.entities.chatBots?.chatted);
  
  useEffect(() => {
    dispatch(fetchChatBots())
    dispatch(fetchUserChatBots(currentUser._id))
  }, [currentUser, dispatch]);

  const clickHandler = (chatBotId) => (e)=>{
    dispatch(createChat({chatBotId}));
    history.push(`/chatbots/${chatBotId}`)
  } 

    return (
      <div className='profile-bots-container'>
        <div className="profile-created-container">
          <h1>Your Created Chatbots</h1>
          {userChatBots.length === 0 && <h1>No Chatbots Created Yet!</h1>}
          {Object.values(userChatBots).map((bot, i)=>{
                return(
                    <ul key={bot._id} className="profile-bot-details" >
                      <img className='profile-bot-img' src={bot.profileImageUrl} alt={bot.name}/>
                      <li title={bot.name}>{bot.name}</li>
                      <li title={bot.name}>{bot._id}</li>
                      {chatted.includes(bot._id) ? <Link to={`/chatbots/${bot._id}`} id="resume-button">Resume Chat</Link> : <button onClick={clickHandler(bot._id)} id="chat-button"> Start Chat</button>}
                      <button className='popup-button' onClick={()=> dispatch(openModal({name: 'clone', chatbotId: bot._id}))}>Clone Bot</button>
                      <button className='popup-button' onClick={()=> dispatch(openModal({name: 'edit', chatbotId: bot._id}))}>Edit Bot</button>
                      <button className='popup-button' onClick={()=> dispatch(openModal({name: 'delete', chatbotId: bot._id}))}>Delete Bot</button>
                    </ul>
                )
          })}

         
        </div>
        <div className='profile-chat-history-container'>
          <h1>Your Recently Chatted Chatbots</h1>
          {chatted.length === 0 && <h1>No Chatbots Chatted Yet!</h1>}
          {Object.values(chatted).map((id)=>{
                const bot = chatBots[id]
                return(
                    <ul key={id} className="profile-bot-details" >
                      <img className='profile-bot-img' src={bot.profileImageUrl} alt={bot.name}/>
                      <li title={bot.name}>{bot.name}</li>
                      {chatted.includes(bot._id) ? <Link to={`/chatbots/${bot._id}`} id="resume-button">Resume Chat</Link> : <button onClick={clickHandler(bot._id)} id="chat-button"> Start Chat</button>}
                      <button className='popup-button' onClick={()=> dispatch(openModal({name: 'clone', chatbotId: bot._id}))}>Clone Bot</button>
                      <button className='popup-button' onClick={()=> dispatch(openModal({name: 'clear history', chatbotId: bot._id}))}>Clear Chat History</button>
                    </ul>
                )
          })}
        </div>
      </div>
    );
  }

export default Profile;