import { combineReducers } from 'redux';
import { sessionErrorsReducer } from './session';
import { postErrorsReducer } from './posts';
import { chatErrorsReducer } from './chat';
import { chatBotErrorsReducer } from './chatbots';


export default combineReducers({
  session: sessionErrorsReducer,
  posts: postErrorsReducer,
  chat: chatErrorsReducer,
  chatBot: chatBotErrorsReducer
});