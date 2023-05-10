import jwtFetch from './jwt';

const RECEIVE_CHATBOTS = "chatbots/RECEIVE_CHATBOTS";
export const REMOVE_CHATBOT = "chatbots/REMOVE_CHATBOT";
const RECEIVE_CHATBOT = "chatbots/REMOVE_CHATBOT";


const RECEIVE_USER_CHATBOTS = "chatbots/RECEIVE_USER_CHATBOTS";
export const RECEIVE_NEW_CHATBOT = "chatbots/RECEIVE_NEW_CHATBOT";
const RECEIVE_CHATBOT_ERRORS = "chatbots/RECEIVE_CHATBOT_ERRORS";
const CLEAR_CHATBOT_ERRORS = "chatbots/CLEAR_CHATBOT_ERRORS";

const receiveChatBots = chatBots => ({
  type: RECEIVE_CHATBOTS,
  chatBots
});
const receiveChatBot = chatBot => ({
  type: RECEIVE_CHATBOT,
  chatBot
});

const removeChatBot = chatBotId => ({
  type: REMOVE_CHATBOT,
  chatBotId
});

const receiveUserChatBots = chatBots => ({
  type: RECEIVE_USER_CHATBOTS,
  chatBots
});

const receiveNewChatBot = payload => ({
  type: RECEIVE_NEW_CHATBOT,
  payload
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

export const fetchChatBot = (id) => async dispatch => {
  try {
    const res = await jwtFetch (`/api/chatbots/${id}`);
    const chatBot = await res.json();
    dispatch(receiveNewChatBot(chatBot));
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

export const composeChatBot = (chatBot, image) => async dispatch => {
  const { name, bio, location} = chatBot;
  const formData = new FormData();
  formData.append("name", name);
  formData.append("bio", bio);
  formData.append("location", location);
  formData.append("image", image);
  try {
    const res = await jwtFetch('/api/chatbots/', {
      method: 'POST',
      body: formData
    });
    const chatBot = await res.json();
    dispatch(receiveNewChatBot(chatBot));
  } catch(err) {
    const resBody = await err.json();
    if (resBody.statusCode === 400) {
      return dispatch(receiveErrors(resBody.errors));
    }
  }
};

export const updateChatBot = (chatBotInfo, image) => async dispatch => {
  const { name, bio, location} = chatBotInfo;
  const formData = new FormData();
  formData.append("name", name);
  formData.append("bio", bio);
  formData.append("location", location);
  formData.append("image", image);
  try {
    const res = await jwtFetch(`/api/chatbots/${chatBotInfo._id}`, {
      method: 'PATCH',
      body: formData
    });
    const chatBot = await res.json();
    dispatch(receiveNewChatBot(chatBot));
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

const chatBotsReducer = (state = { all: {}, user: {}, new: undefined }, action) => {
  switch(action.type) {
    case RECEIVE_CHATBOTS:
      return { ...state, all: action.chatBots, new: undefined};
    case RECEIVE_USER_CHATBOTS:
      return { ...state, user: action.chatBots, new: undefined};
    case RECEIVE_NEW_CHATBOT:
      return { ...state, new: action.payload.chatBot};
    case REMOVE_CHATBOT:
      const newState = {...state, user: {}, new: undefined }
      delete newState.all[action.chatBotId]
      return newState;
    default:
      return state;
  }
};

export default chatBotsReducer;