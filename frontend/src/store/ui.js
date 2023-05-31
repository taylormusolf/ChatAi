import { combineReducers } from 'redux';
import prompts from './prompts';
import images from './images';
import modal from './modal';
import battle from './battle';

export default combineReducers({
  prompts,
  images,
  modal,
  battle
});