import { combineReducers } from 'redux';
import posts from './posts';
import chatBots from './chatbots';
import chats from './chat';

export default combineReducers({
  posts,
  chatBots,
  chats
});