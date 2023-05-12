import { combineReducers } from 'redux';
import chat from './chat';
import prompts from './prompts';
import images from './images';

export default combineReducers({
  // chat
  prompts,
  images
});