import { useEffect } from "react";
import {useDispatch, useSelector} from "react-redux";
import { fetchChatBots } from "../../store/chatbots";
import {Link} from "react-router-dom";
import './ChatBotIndex.css'

function ChatBotIndex(){
  const dispatch = useDispatch();
  const chatBots = useSelector(state => Object.values(state.entities.chatBots.all).length !== 0 ?  state.entities.chatBots.all : []  )
  useEffect(()=>{
    dispatch(fetchChatBots())
  }, [dispatch])



  return(
    <div className="chatbots-index-container">
      {chatBots?.map((bot, i)=>{
        return(
          <ul className="chatbots-index-details" key={i}>
            <Link to={`/chatbots/${bot._id}`}><li>{bot.name}</li></Link>
            <Link to={`/chatbots/${bot._id}`}><img src={bot.profileImageUrl} alt={bot.name}/></Link>
          </ul>
        )
      })}
      <Link to='/chatbots/new'>Create a new chatbot</Link>
    </div>
  )

  
  

}

export default ChatBotIndex;