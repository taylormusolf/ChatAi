import { combineReducers } from 'redux';
import chatBots from './chatbots';
import chats from './chat';

export default combineReducers({
  chatBots,
  chats
});