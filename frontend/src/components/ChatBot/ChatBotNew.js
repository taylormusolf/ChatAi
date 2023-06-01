import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {createChatBot} from '../../store/chatbots'
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import { fetchImages, clearImages } from '../../store/images.js';
import './ChatBotNew.css'
import { closeModal } from '../../store/modal';

function ChatBotNew(){
  const [name, setName] = useState('');
  const [prompt, setPrompt] = useState('');
  const [from, setFrom] = useState('');
  const [description, setDescription] = useState('');
  const [greeting, setGreeting] = useState('');
  const [image, setImage] = useState(null);
  const [imagePrompt, setImagePrompt] = useState('');
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
      case 'prompt':
        setState = setPrompt;
        break;
      case 'from':
        setState = setFrom;
        break;
      case 'imagePrompt':
        setState = setImagePrompt;
        break;
      case 'description':
        setState = setDescription;
        break;
      case 'greeting':
        setState = setGreeting;
        break;
      default:
        throw Error('Unknown field in Form');
    }
  
    return e => setState(e.currentTarget.value);
  }

  const generateImage = e => {
    e.preventDefault();
    setLoadingImage(true);
    dispatch(fetchImages({name, prompt, from}, imagePrompt)).then(() => setLoadingImage(false));
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


  const chatBotSubmit = e => {
    e.preventDefault();
    const bot = {
      name,
      from,
      image,
      prompt,
      description,
      greeting
    };
  
    dispatch(createChatBot(bot)); 
    // setName('');
    // setFrom('');
    // setPrompt('');
    // setDescription('');
    // setGreeting('');
    // setImage(null);
    // setPhotoUrl(null);
    dispatch(clearImages());
    dispatch(closeModal());
  }
  

  return (
      <div className="chatbot-form-container">
        <form className="chatbot-form" onSubmit={chatBotSubmit}>
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
          <div className="errors">{errors?.from}</div>
          <label>
            <span>From</span>
            <input type="from"
              value={from}
              onChange={update('from')}
              placeholder="Town, Universe, etc. to give context to your chatbot."
            />
          </label>
          <div className="errors">{errors?.description}</div>
          <label>
            <span>Description</span>
            <input type="description"
              value={description}
              onChange={update('description')}
              placeholder="How does the chatbot perceive itself?"
            />
          </label>
          <div className="errors">{errors?.greeting}</div>
          <label>
            <span>Greeting</span>
            <input type="greeting"
              value={greeting}
              onChange={update('greeting')}
              placeholder="How does the chatbot introduce itself?"
            />
          </label>
          <div className="errors">{errors?.prompt}</div>
          <label>
            <span>Additional Prompt</span>
            <textarea type="prompt"
              value={prompt}
              onChange={update('prompt')}
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
            disabled={!name || !greeting}
          />
          </form>
          {photoUrl? <img className='preview' src={photoUrl} alt='preview' /> : null}
          {loadingImage? <div className='loading'>Loading...</div> : null}
          {aiProfileImages?.map((image, i) => <img key={i} src={image.url} alt='profile' />)}
          {/* <input type='text' value={imagePrompt}
              onChange={update('imagePrompt')}
              placeholder="Image imagePrompt"/> */}
          {/* <button onClick={generateImage} disabled={!imagePrompt || loadingImage} >Generate Profile Picture</button> */}

        </div>
    );
}

export default ChatBotNew;






