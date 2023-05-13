import jwtFetch from './jwt';
import { REMOVE_CHATBOT, RECEIVE_NEW_CHATBOT, RECEIVE_CHATBOT, RECEIVE_CHATBOTS } from './chatbots';

const RECEIVE_CHAT = "chats/RECEIVE_CHAT";
const REMOVE_CHAT = "chats/REMOVE_CHAT";

const RECEIVE_CHAT_REQUEST = "chats/RECEIVE_CHAT_REQUEST";
const RECEIVE_CHAT_RESPONSE = "chats/RECEIVE_CHAT_RESPONSE";

const RECEIVE_CHAT_ERRORS = "chats/RECEIVE_CHAT_ERRORS";
const CLEAR_CHAT_ERRORS = "chats/CLEAR_CHAT_ERRORS";

const receiveChat = chat => ({
  type: RECEIVE_CHAT,
  chat
});

const removeChat = chatId => ({
  type: REMOVE_CHAT,
  chatId
});

export const receiveChatRequest = (chatRequest) => ({
  type: RECEIVE_CHAT_REQUEST,
  chatRequest
});
const receiveChatResponse = (chat) => ({
  type: RECEIVE_CHAT_RESPONSE,
  chat
});

const receiveErrors = errors => ({
  type: RECEIVE_CHAT_ERRORS,
  errors
});

//initialize chat with a chatBot for the first time
export const createChat = (chat) => async dispatch => {
  try {
    const res = await jwtFetch('/api/chats/', {
      method: 'POST',
      body: JSON.stringify(chat)
    });
    const data = await res.json();
    dispatch(receiveChat(data));
  } catch(err) {
    const resBody = await err.json();
    if (resBody.statusCode === 400) {
      return dispatch(receiveErrors(resBody.errors));
    }
  }
}

//clear chat history with a chatBot
export const deleteChat = (chatId) => async dispatch =>{
  try {
      await jwtFetch(`/api/chats/${chatId}`, {
      method: 'DELETE'
    });
    dispatch(removeChat(chatId));
  } catch(err) {
    const resBody = await err.json();
    if (resBody.statusCode === 400) {
      return dispatch(receiveErrors(resBody.errors));
    }
  }
}

//ask new question to chatBot in an existing chat
export const fetchChatResponse = (chatId, chatRequest)=> async dispatch=> {
  
  try {
    const res = await jwtFetch (`/api/chats/${chatId}`, {
      method: 'PATCH',
      body: JSON.stringify({chatRequest})
    });
    const chatResponse = await res.json();
    dispatch(receiveChatResponse(chatResponse));
  } catch (err) {
    const resBody = await err.json();
    if (resBody.statusCode === 400) {
      dispatch(receiveErrors(resBody.errors));
    }
  }
};


const nullErrors = null;

export const chatErrorsReducer = (state = nullErrors, action) => {
  switch(action.type) {
    case RECEIVE_CHAT_ERRORS:
      return action.errors;
    case CLEAR_CHAT_ERRORS:
      return nullErrors;
    default:
      return state;
  }
};

const chatsReducer = (state = { all: {}, current: {}, user:{}}, action) => {
  const newCurrent = {...state.current};
  switch(action.type) {
    // case RECEIVE_CHATS:
    //   return { ...state, all: action.chats, new: undefined};
    case RECEIVE_CHATBOTS:
      return {...state, current: {}};
    case RECEIVE_CHATBOT:
      return {...state, current: action.payload.chat};
    // case RECEIVE_NEW_CHATBOT:
    //   return {...state, current: action.payload.chat};
    case REMOVE_CHATBOT:
      return {...state, current:{}};
    case REMOVE_CHAT:
      return {...state, current:{messages:[]}};
    case RECEIVE_CHAT_REQUEST:
      // return [...state, {role: 'user', content: action.chatRequest}]
      newCurrent.messages.push({role: 'user', content: action.chatRequest})
      return {...state, current: newCurrent }
    case RECEIVE_CHAT_RESPONSE:
      // newCurrent.messages.push({role:'assistant', content: action.chatResponse})
      return {...state, current: action.chat }
    case RECEIVE_CHAT:
      return {...state, current: action.chat }
    default:
      return state;
  }
};

export default chatsReducer;