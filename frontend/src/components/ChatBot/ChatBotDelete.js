import { useDispatch, useSelector } from "react-redux";
import { deleteChatBot } from "../../store/chatbots";
import { closeModal } from "../../store/modal";
import { useHistory } from "react-router-dom";

function ChatBotDelete(){
  // const {chatbotId} = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const chatbot = useSelector(state => state.entities.chatBots?.new ? state.entities.chatBots.new : null  )
  const modal = useSelector(state => state.ui.modal);

  const handleDelete = e => {
    e.preventDefault();
    if(modal.chatbotId){ //came from profile page
      dispatch(deleteChatBot(modal.chatbotId));
      dispatch(closeModal());
    }else{ //came from chat show page
      dispatch(deleteChatBot(chatbot._id));
      dispatch(closeModal());
      history.push('/chatbots')
    }
  }



  return (
    <div className="chatbot-conformation-popup">
      <h1>Are you sure you want to delete this chatbot?</h1>
      <div className="chatbot-conformation-popup-buttons">
        <button className='red-button' onClick={handleDelete}>Delete</button>
        <button className='green-button' onClick={()=>dispatch(closeModal())}>Cancel</button>
      </div>
    </div>
  )

}



export default ChatBotDelete;