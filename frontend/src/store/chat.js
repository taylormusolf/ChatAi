import jwtFetch from './jwt';

const RECEIVE_CHATS = "chats/RECEIVE_CHATS";
const RECEIVE_CHAT_REQUEST = "chats/RECEIVE_CHAT_REQUEST";
const RECEIVE_CHAT_RESPONSE = "chats/RECEIVE_CHAT_RESPONSE";

const RECEIVE_CHAT_ERRORS = "chats/RECEIVE_CHAT_ERRORS";
const CLEAR_CHAT_ERRORS = "chats/CLEAR_CHAT_ERRORS";

const receiveChats = chats => ({
  type: RECEIVE_CHATS,
  chats
});

export const receiveChatRequest = (chatRequest) => ({
  type: RECEIVE_CHAT_REQUEST,
  chatRequest
});
const receiveChatResponse = (chatResponse) => ({
  type: RECEIVE_CHAT_RESPONSE,
  chatResponse
});

const receiveErrors = errors => ({
  type: RECEIVE_CHAT_ERRORS,
  errors
});

export const fetchChatResponse = (chatRequest)=> async dispatch=> {
  
  try {
    const res = await jwtFetch ('/api/chatbot', {
      method: 'POST',
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

const chatReducer = (state = [], action) => {
  switch(action.type) {
    // case RECEIVE_CHATS:
    //   return { ...state, all: action.chats, new: undefined};
    case RECEIVE_CHAT_REQUEST:
      return [...state, {role: 'user', content: action.chatRequest}]
    case RECEIVE_CHAT_RESPONSE:
      return [...state, {role:'assistant', content: action.chatResponse}]
    default:
      return state;
  }
};

export default chatReducer;