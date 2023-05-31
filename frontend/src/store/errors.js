import { combineReducers } from 'redux';
import { sessionErrorsReducer } from './session';
// import { postErrorsReducer } from './posts';
import { chatErrorsReducer } from './chat';
import { chatBotErrorsReducer } from './chatbots';
import { battleErrorsReducer } from './battle';


export default combineReducers({
  session: sessionErrorsReducer,
  // posts: postErrorsReducer,
  chat: chatErrorsReducer,
  chatBot: chatBotErrorsReducer,
  battle: battleErrorsReducer
});