import jwtFetch from './jwt';

const RECEIVE_BATTLE_RESPONSE = "battle/RECEIVE_BATTLE_RESPONSE";
const CLEAR_BATTLE_RESPONSE = "battle/CLEAR_BATTLE_RESPONSE";
const RECEIVE_BATTLE_ERRORS = "battle/RECEIVE_BATTLE_ERRORS";

const receiveBattleResponse = response => ({
    type: RECEIVE_BATTLE_RESPONSE,
    response
});

export const clearBattleResponse = () => ({
    type: CLEAR_BATTLE_RESPONSE
});

const receiveBattleErrors = errors => ({
  type: RECEIVE_BATTLE_ERRORS,
  errors
});


export const fetchBattleResponse = (chatbot1, chatbot2, prompt, currentChatbot, messages) => async dispatch => {
  try {
        const res = await jwtFetch('/api/battle', {
            method: 'POST',
            body: JSON.stringify({chatbot1, chatbot2, prompt, currentChatbot, messages})
        });
        
        const response = await res.json();
        dispatch(receiveBattleResponse(response));
    } catch (err) {
        console.log(err);
        dispatch(receiveBattleErrors(err));
    }
}

const nullErrors = null;

export const battleErrorsReducer = (state = nullErrors, action) => {
  switch(action.type) {
    case RECEIVE_BATTLE_ERRORS:
      return action.errors;
    case RECEIVE_BATTLE_RESPONSE:
    case CLEAR_BATTLE_RESPONSE:
      return nullErrors;
    default:
      return state;
  }
};





const battleReducer = (state = [], action) => {
    switch (action.type) {
        case RECEIVE_BATTLE_RESPONSE:
            return [...state, action.response];
        case CLEAR_BATTLE_RESPONSE:
            return [];
        default:
            return state;
    }
}

export default battleReducer;
