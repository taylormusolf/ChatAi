import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {createChatBot} from '../../store/chatbots'
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import { fetchImages, clearImages } from '../../store/images.js';
import './ChatBotNew.css'

function ChatBotNew(){
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState(null);
  const [prompt, setPrompt] = useState('');
  const aiProfileImages = useSelector(state => state.ui.images);
  const [loadingImage, setLoadingImage] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(null);
  const errors = useSelector(state => state.errors.session);
  const dispatch = useDispatch();


  const update = field => {
    let setState;
  
    switch (field) {
      case 'name':
        setState = setName;
        break;
      case 'bio':
        setState = setBio;
        break;
      case 'location':
        setState = setLocation;
        break;
      case 'prompt':
        setState = setPrompt;
        break;
      default:
        throw Error('Unknown field in Form');
    }
  
    return e => setState(e.currentTarget.value);
  }

  const generateImage = e => {
    e.preventDefault();
    setLoadingImage(true);
    dispatch(fetchImages({name, bio, location}, prompt)).then(() => setLoadingImage(false));
  }

  // const updateFile = e => setImage(e.target.files[0]);

  const handleFile = ({ currentTarget }) => {
    const file = currentTarget.files[0];
    setImage(file);
    if (file) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => setPhotoUrl(fileReader.result);
    }else {
      setPhotoUrl(null);
    }
  }


  const usernameSubmit = e => {
    e.preventDefault();
    const bot = {
      name,
      location,
      image,
      bio
    };
  
    dispatch(createChatBot(bot)); 
    setName('');
    setLocation('');
    setBio('');
    setImage(null);
    setPhotoUrl(null);

  }
  

  return (
      <div className="chatbot-form-container">
        <form className="chatbot-form" onSubmit={usernameSubmit}>
          <h2>ChatBot Create Form</h2>
          <div className="errors">{errors?.name}</div>
          <label>
            <span>Name</span>
            <input type="text"
              value={name}
              onChange={update('name')}
              placeholder="name"
            />
          </label>
          <div className="errors">{errors?.location}</div>
          <label>
            <span>From</span>
            <input type="location"
              value={location}
              onChange={update('location')}
              placeholder="Town, Universe, etc. to give context to your chatbot."
            />
          </label>
          <div className="errors">{errors?.bio}</div>
          <label>
            <span>Additional Prompt</span>
            <textarea type="bio"
              value={bio}
              onChange={update('bio')}
              placeholder="Details about your chatbot so it acts the way you want."
            />
          </label>
          <label>
            Chatbot Image
            <input type="file" accept=".jpg, .jpeg, .png" onChange={handleFile} />
          </label>
          <input
            type="submit"
            value="Create"
            disabled={!name || !location || !bio}
          />
          </form>
          {photoUrl? <img className='preview' src={photoUrl} alt='preview' /> : null}
          {loadingImage? <div className='loading'>Loading...</div> : null}
          {aiProfileImages?.map((image, i) => <img key={i} src={image.url} alt='profile' />)}
          <input type='text' value={prompt}
              onChange={update('prompt')}
              placeholder="Image Prompt"/>
          <button onClick={generateImage} disabled={!prompt || loadingImage} >Generate Profile Picture</button>
          <Link to='/chatbots'>Back to chatbot index</Link>
        </div>
    );
}

export default ChatBotNew;






