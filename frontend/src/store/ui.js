import { combineReducers } from 'redux';
import prompts from './prompts';
import images from './images';
import modal from './modal';

export default combineReducers({
  prompts,
  images,
  modal
});