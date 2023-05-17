import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../store/modal";
import { deleteChat, createChat } from "../../store/chat";

function ClearChatHistoryPrompt(){
  const dispatch = useDispatch();
  const chatbot = useSelector(state => state.entities.chatBots?.new ? state.entities.chatBots.new : null  )
  const chat = useSelector(state => Object.keys(state.entities.chats).length === 0 ? null : state.entities.chats.current);

  const handleClear = e => {
    e.preventDefault();
    // console.log('clearing chat history', chat?._id, chatbot?._id)
    dispatch(deleteChat(chat?._id))
    dispatch(createChat({chatBot: chatbot?._id}))
    dispatch(closeModal())
  }



  return (
    <div className="chatbot-clear-history-confirmation">
      <h1>Are you sure you want to clear this chatbot's history?  It will be gone forever.</h1>
      <button onClick={handleClear}>Yes</button>
      <button onClick={()=>dispatch(closeModal())}>No</button>
    </div>
  )

}



export default ClearChatHistoryPrompt;