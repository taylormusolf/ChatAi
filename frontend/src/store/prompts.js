import jwtFetch from './jwt';

const RECEIVE_PROMPTS = "prompts/RECEIVE_PROMPTS";
const REMOVE_PROMPTS = "prompts/REMOVE_PROMPTS";

const receivePrompts = prompts => ({
    type: RECEIVE_PROMPTS,
    prompts
});

const removePrompts = () => ({
    type: REMOVE_PROMPTS
});

export const fetchPrompts = (chatbotId) => async dispatch => {
    try {
        const res = await jwtFetch('/api/prompts', {
            method: 'POST',
            body: JSON.stringify({chatbotId})
        });
        const prompts = await res.json();
        dispatch(receivePrompts(prompts));
    } catch (err) {
        console.log(err);
    }
}

export const clearPrompts = () => async dispatch => {
    dispatch(removePrompts());
}


const promptsReducer = (state = {}, action) => {
    switch (action.type) {
        case RECEIVE_PROMPTS:
            return action.prompts;
        case REMOVE_PROMPTS:
            return {};
        default:
            return state;
    }
}

export default promptsReducer;
