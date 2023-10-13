import jwtFetch from './jwt';
import {RECEIVE_USER_LOGOUT} from './session'

export const RECEIVE_CHATBOTS = "chatbots/RECEIVE_CHATBOTS";
export const REMOVE_CHATBOT = "chatbots/REMOVE_CHATBOT";
export const RECEIVE_CHATBOT = "chatbots/RECEIVE_CHATBOT";
export const RECEIVE_SEARCH_CHATBOTS = "chatbots/RECEIVE_SEARCH_CHATBOTS";

const RECEIVE_USER_CHATBOTS = "chatbots/RECEIVE_USER_CHATBOTS";
export const RECEIVE_NEW_CHATBOT = "chatbots/RECEIVE_NEW_CHATBOT";
const RECEIVE_CHATBOT_ERRORS = "chatbots/RECEIVE_CHATBOT_ERRORS";
const CLEAR_CHATBOT_ERRORS = "chatbots/CLEAR_CHATBOT_ERRORS";

const receiveChatBots = payload => ({
  type: RECEIVE_CHATBOTS,
  payload
});

export const receiveSearchChatBots = payload => ({
  type: RECEIVE_SEARCH_CHATBOTS,
  payload
});
const receiveChatBot = payload => {
  return {
  type: RECEIVE_CHATBOT,
  payload
  }
};

const removeChatBot = chatbotId => ({
  type: REMOVE_CHATBOT,
  chatbotId
});

const receiveUserChatBots = chatbots => ({
  type: RECEIVE_USER_CHATBOTS,
  chatbots
});

const receiveNewChatBot = chatbot=> ({
  type: RECEIVE_NEW_CHATBOT,
  chatbot
});

const receiveErrors = errors => ({
  type: RECEIVE_CHATBOT_ERRORS,
  errors
});

export const clearChatBotErrors = errors => ({
    type: CLEAR_CHATBOT_ERRORS,
    errors
});




export const fetchChatBots = () => async dispatch => {
  try {
    const res = await jwtFetch ('/api/chatbots');
    const chatBots = await res.json();
    dispatch(receiveChatBots(chatBots));
  } catch (err) {
    const resBody = await err.json();
    if (resBody.statusCode === 400) {
      dispatch(receiveErrors(resBody.errors));
    }
  }
};

export const searchChatBots = (query) => async dispatch => {
  try {
    const res = await jwtFetch (`/api/chatbots?query=${query}`);
    const chatBots = await res.json();
    dispatch(receiveSearchChatBots(chatBots));
  } catch (err) {
    const resBody = await err.json();
    if (resBody.statusCode === 400) {
      dispatch(receiveErrors(resBody.errors));
    }
  }
};


export const fetchChatBot = (id) => async dispatch => {
  try {
    const res = await jwtFetch (`/api/chatbots/${id}`);
    const chatBot = await res.json();
    dispatch(receiveChatBot(chatBot));
  } catch (err) {
    const resBody = await err.json();
    if (resBody.statusCode === 400) {
      dispatch(receiveErrors(resBody.errors));
    }
  }
};

export const fetchUserChatBots = id => async dispatch => {
  try {
    const res = await jwtFetch(`/api/chatbots/user/${id}`);
    const chatBots = await res.json();
    dispatch(receiveUserChatBots(chatBots));
  } catch(err) {
    const resBody = await err.json();
    if (resBody.statusCode === 400) {
      return dispatch(receiveErrors(resBody.errors));
    }
  }
};

export const createChatBot = (chatBot) => async dispatch => {
  const { image, name, prompt, from, description, greeting} = chatBot;
  const formData = new FormData();
  formData.append("name", name);
  formData.append("prompt", prompt);
  formData.append("from", from);
  formData.append("description", description);
  formData.append("greeting", greeting);
  formData.append("image", image);
  try {
    const res = await jwtFetch('/api/chatbots/', {
      method: 'POST',
      body: formData
    });
    const chatBot = await res.json();
    dispatch(receiveNewChatBot(chatBot));
    return chatBot;
  } catch(err) {
    const resBody = await err.json();
    if (resBody.statusCode === 400) {
      return dispatch(receiveErrors(resBody.errors));
    }
  }
};

export const updateChatBot = (chatBotInfo) => async dispatch => {
  const { name, prompt, from, image, greeting, description} = chatBotInfo;
  const formData = new FormData();
  formData.append("name", name);
  formData.append("prompt", prompt);
  formData.append("from", from);
  formData.append("greeting", greeting);
  formData.append("description", description);
  formData.append("image", image);
  try {
    const res = await jwtFetch(`/api/chatbots/${chatBotInfo._id}`, {
      method: 'PATCH',
      body: formData
    });
    const data = await res.json();
    dispatch(receiveChatBot(data));
  } catch(err) {
    const resBody = await err.json();
    if (resBody.statusCode === 400) {
      return dispatch(receiveErrors(resBody.errors));
    }
  }
};

export const deleteChatBot = (chatBotId) => async dispatch => {
  try {
    const res = await jwtFetch(`/api/chatbots/${chatBotId}`, {
      method: 'DELETE'
    });
    dispatch(removeChatBot(chatBotId));
  } catch(err) {
    const resBody = await err.json();
    if (resBody.statusCode === 400) {
      return dispatch(receiveErrors(resBody.errors));
    }
  }
};


const nullErrors = null;

export const chatBotErrorsReducer = (state = nullErrors, action) => {
  switch(action.type) {
    case RECEIVE_CHATBOT_ERRORS:
      return action.errors;
    case RECEIVE_NEW_CHATBOT:
    case CLEAR_CHATBOT_ERRORS:
      return nullErrors;
    default:
      return state;
  }
};

const chatBotsReducer = (state = { all: {}, user: {}, chatted: [], new: undefined, search: {} }, action) => {
  switch(action.type) {
    case RECEIVE_CHATBOTS:
      const nextAll= {...state.all};
      action.payload.chatbots.forEach((chatbot)=>{
        nextAll[chatbot._id] = chatbot;
      })
      return { ...state, all: nextAll, chatted: action.payload.chattedChatbotIds, new: undefined, search: {}};
    case RECEIVE_SEARCH_CHATBOTS:
      const nextSearch = {};
      action.payload.chatbots.forEach((chatbot)=>{
        nextSearch[chatbot._id] = chatbot;
      })
      return { ...state, chatted: action.payload.chattedChatbotIds, search: nextSearch};
    case RECEIVE_USER_CHATBOTS:
      const nextUser= {...state.user};
      action.chatbots.forEach((chatbot)=>{
        nextUser[chatbot._id] = chatbot;
      })
      return { ...state, user: nextUser, new: undefined};
    case RECEIVE_USER_LOGOUT:
      return { ...state, user: {}, new: undefined};
    case RECEIVE_CHATBOT:
      return { ...state, new: action.payload.chatbot};
    case RECEIVE_NEW_CHATBOT:
      return { ...state, new: action.chatbot, all: {...state.all, [action.chatbot._id]:action.chatbot}, user: {...state.user, [action.chatbot._id]:action.chatbot} };
    case REMOVE_CHATBOT:
      const newState = {...state, new: undefined }
      delete newState.all[action.chatbotId]
      delete newState.user[action.chatbotId]
   
      return newState;
    default:
      return state;
  }
};

export default chatBotsReducer;