import jwtFetch from './jwt';

const RECEIVE_IMAGES = "images/RECEIVE_IMAGES";
const REMOVE_IMAGES = "images/REMOVE_IMAGES";


const receiveImages = images => ({
    type: RECEIVE_IMAGES,
    images
});

const removeImages = () => ({
    type: REMOVE_IMAGES
});

export const fetchImages = (chatbot) => async dispatch => {
    try {
        const res = await jwtFetch('/api/images', {
            method: 'POST',
            body: JSON.stringify({chatbot})
        });
        const images = await res.json();
        dispatch(receiveImages(images));
    } catch (err) {
        console.log(err);
    }
}

export const clearImages = () => async dispatch => {
    dispatch(removeImages());
}

const imagesReducer = (state = [], action) => {
    switch (action.type) {
        case RECEIVE_IMAGES:
            return action.images.response.data;
        case REMOVE_IMAGES:
            return [];
        default:
            return state;
    }
}

export default imagesReducer;

