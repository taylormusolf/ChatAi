import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserChatBots, deleteChatBot } from '../../store/chatbots';
import {Link} from 'react-router-dom'
import './Profile.css'

function Profile () {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.session.user);
  const userChatBots = useSelector(state => state.entities.chatBots.user)
  
  useEffect(() => {

    dispatch(fetchUserChatBots(currentUser._id))
  }, [currentUser, dispatch]);

 
    return (
      <>
      <div className='profile-bots-container'>
        <h2>All of {currentUser.username}'s Chatbots</h2>
        <div className='profile-bots'>
          {userChatBots?.map((bot)=>{
            return (<ul className='profile-bot' key={bot._id}>
              <li>{bot.name}</li>
              <img src={bot.profileImageUrl} alt={bot.name}/>
              <Link to={`/chatbots/${bot._id}/edit`}>Edit</Link>
              <button onClick={()=>dispatch(deleteChatBot(bot._id))}>Delete Bot</button>
            </ul>)
          })}
          </div>
        </div>
      </>
    );
  }

export default Profile;