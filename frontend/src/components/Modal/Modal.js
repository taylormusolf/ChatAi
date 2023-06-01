import React from "react";
import { closeModal } from "../../store/modal";
import { useDispatch, useSelector } from "react-redux";
import ChatBotEdit from "../ChatBot/ChatBotEdit";
import ChatBotNew from "../ChatBot/ChatBotNew";
import ChatBotDelete from "../ChatBot/ChatBotDelete";
import ClearChatHistoryPrompt from "../ChatBot/ClearChatHistoryPrompt";
import ChatBotClone from "../ChatBot/ChatBotClone";
import './Modal.css'



const Modal = () => {
  const dispatch = useDispatch();
  const modal = useSelector(state => state.ui.modal);
  if (!modal) {
    return null;
  }
  const {name} = modal;
  let component;
  switch (name) {
    case "edit":
      // component = <ChatBotEdit/>;
      component = <ChatBotNew form='edit'/>;
      break;
    case "new":
      component = <ChatBotNew form='new'/>;
      break;
    case "delete":
      component = <ChatBotDelete/>;
      break;
    case "clear history":
      component = <ClearChatHistoryPrompt/>;
      break;
    case "clone":
      // component = <ChatBotClone/>;
      component = <ChatBotNew form='clone'/>;
      break;
    default:
      return null;
  }
  return (
    <div className="modal-background" onClick={()=> dispatch(closeModal())}>
      <div className="modal-child" onClick={(e) => e.stopPropagation()}>
        {component}
      </div>
    </div>
  );

}

export default Modal;