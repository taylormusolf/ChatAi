import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserChatBots, fetchChatBots } from '../../store/chatbots';
import { logout } from '../../store/session';
import { createChat } from "../../store/chat";
import {Link , useHistory} from "react-router-dom";
import { openModal } from '../../store/modal';
import {RiLogoutBoxRLine} from 'react-icons/ri';

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
  const logoutUser = e => {
    e.preventDefault();
    dispatch(logout());
  }

    return (
      <div className='profile-container'>
        <div className='profile-logout'>
          <h1>You are currently signed in as <strong>{currentUser?.username}</strong> <button onClick={logoutUser} id="logout-button" title='Logout'> <RiLogoutBoxRLine /></button></h1>
          
        </div>
        <div className='profile-bots-container'>
          <div className="profile-created-container">
            <h1>Your Created Chatbots</h1>
            {Object.values(userChatBots).length === 0 && <div className="profile-bot-details"><h1>No Chatbots Created Yet!</h1> </div>}
            {Object.values(userChatBots).map((bot, i)=>{
                  return(
                      <ul key={bot._id} className="profile-bot-details" >
                        <div className='profile-bot-subdetails'>
                          <img className='profile-bot-img' src={bot.profileImageUrl} alt={bot.name}/>
                          <div className='profile-bot-name-wrapper'>
                            <li title={bot.name}>{bot.name}</li>
                          </div>
                        </div>
                        <div className='profile-bot-buttons'>
                          {chatted.includes(bot._id) ? <Link to={`/chatbots/${bot._id}`} id="resume-button" className='profile-button'>Resume Chat</Link> : <button onClick={clickHandler(bot._id)} id="chat-button" className='profile-button'> Start Chat</button>}
                          <button className='popup-button profile-button' onClick={()=> dispatch(openModal({name: 'clone', chatbotId: bot._id}))}>Clone</button>
                          <button className='popup-button profile-button' onClick={()=> dispatch(openModal({name: 'edit', chatbotId: bot._id}))}>Edit</button>
                          <button className='popup-button profile-button' onClick={()=> dispatch(openModal({name: 'delete', chatbotId: bot._id}))}>Delete</button>
                        </div>
                      </ul>
                  )
            })}

          
          </div>
          <div className='profile-chat-history-container'>
            <h1>Your Recently Chatted Chatbots</h1>
            {Object.values(chatted) === 0 && <div className="profile-bot-details"><h1>No Chatbots Chatted Yet!</h1> </div>}
            {Object.values(chatted).map((id)=>{
              const bot = chatBots[id]
              return(
                <ul key={bot._id} className="profile-bot-details" >
                  <div className='profile-bot-subdetails'>
                    <img className='profile-bot-img' src={bot.profileImageUrl} alt={bot.name}/>
                    <div className='profile-bot-name-wrapper'>
                      <li title={bot.name}>{bot.name}</li>
                    </div>
                  </div>
                  <div className='profile-bot-buttons'>
                    {chatted.includes(bot._id) ? <Link to={`/chatbots/${bot._id}`} id="resume-button" className='profile-button'>Resume Chat</Link> : <button onClick={clickHandler(bot._id)} id="chat-button" className='profile-button'> Start Chat</button>}
                    <button className='popup-button profile-button' onClick={()=> dispatch(openModal({name: 'clone', chatbotId: bot._id}))}>Clone</button>
                    <button className='popup-button profile-button clear-chat' onClick={()=> dispatch(openModal({name: 'clear history', chatbotId: bot._id}))}>Clear Chat History</button>
                  </div>
                  </ul>
                )
            })}
          </div>
        </div>
      </div>
    );
  }

export default Profile;