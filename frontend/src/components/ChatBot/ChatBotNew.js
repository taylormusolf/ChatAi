import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {createChatBot, fetchChatBot, updateChatBot} from '../../store/chatbots';
import {createChat} from '../../store/chat';
// import { fetchImages, clearImages } from '../../store/images.js';
import { closeModal } from '../../store/modal';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';


function ChatBotNew(props){
  const [name, setName] = useState('');
  const [prompt, setPrompt] = useState('');
  const [from, setFrom] = useState('');
  const [description, setDescription] = useState('');
  const [greeting, setGreeting] = useState('');
  const [image, setImage] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  const errors = useSelector(state => state.errors.session);
  // const [imagePrompt, setImagePrompt] = useState('');
  // const aiProfileImages = useSelector(state => state.ui.images);
  // const [loadingImage, setLoadingImage] = useState(false);
  const {form} = props;
  const history = useHistory();
  const dispatch = useDispatch();
  const chatbot = useSelector(state => state.entities.chatBots?.new ? state.entities.chatBots.new : null )
  const modal = useSelector(state => state.ui.modal);

  useEffect(()=>{
    if(modal.chatbotId){ //came from profile page
      dispatch(fetchChatBot(modal.chatbotId))
    }
  }, [])



  useEffect(()=>{
    if((form === 'edit' || form === 'clone') && chatbot){
      setName(chatbot.name);
      if(chatbot.prompt) setPrompt(chatbot.prompt);
      if(chatbot.from) setFrom(chatbot.from);
      if(chatbot.description) setDescription(chatbot.description);
      if(chatbot.greeting) setGreeting(chatbot.greeting);
    }

  }, [chatbot, form])



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
      // case 'imagePrompt':
      //   setState = setImagePrompt;
      //   break;
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

  // const generateImage = e => {
  //   e.preventDefault();
  //   setLoadingImage(true);
  //   dispatch(fetchImages({name, prompt, from}, imagePrompt)).then(() => setLoadingImage(false));
  // }

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

  const handleClearFile = e => {
    setPhotoUrl(null);
    setImage(null);
    document.getElementsByClassName('picture-input')[0].value = null;

  }

  const chatBotSubmitCleanup = (chatbot) => {
    dispatch(createChat({chatBotId: chatbot?._id})).then(history.push(`/chatbots/${chatbot._id}`));
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

    if(form === 'edit' || form === 'clone'){
      bot._id = chatbot._id;

      let newImage;
      if(image !== null){
        newImage = image;
      }else{
        newImage = chatbot.profileImageUrl
      }
      bot.image = newImage;
    }
    if(form === 'new'){
      dispatch(createChatBot(bot)).then((chatbot)=> chatBotSubmitCleanup(chatbot)); 
    }else if(form === 'clone'){
      dispatch(createChatBot(bot)).then((chatbot)=> chatBotSubmitCleanup(chatbot));
    } else if(form === 'edit'){
      dispatch(updateChatBot(bot)); 
    }
    // dispatch(clearImages());
    dispatch(closeModal());
  }
  

  return (
      <div className="chatbot-form-container">
        <form className="chatbot-form" onSubmit={chatBotSubmit}>
          <h2>{form === 'new' ? 'New Chatbot' : form === 'clone' ? 'Chatbot Clone' : 'Edit Chatbot'}</h2>
          <div className="errors">{errors?.name}</div>
          <div className='input-container'>
            <label id={name && 'filled'}>*Name your chatbot</label>
            <input type="text"
              value={name}
              onChange={update('name')}
              // placeholder="What is their name?"
            />
          </div>
          <div className="errors">{errors?.from}</div>
          <div className='input-container'>
            <label id={from && 'filled'}>From: Town, Universe, etc. to give context</label>
            <input type="text"
              value={from}
              onChange={update('from')}
              // placeholder="Town, Universe, etc. to give context to your chatbot."
            />
          </div>
          <div className="errors">{errors?.description}</div>
          <div className='input-container'>
            <label id={description && 'filled'}>Description: How does it perceive itself?</label>
            <textarea
              value={description}
              onChange={update('description')}
              // placeholder="How does the chatbot perceive itself?"
            />
          </div>
          <div className="errors">{errors?.greeting}</div>
          <div className='input-container'>
            <label id={greeting && 'filled'}>*Greeting: How does it introduce itself?</label>
            <textarea
              value={greeting}
              onChange={update('greeting')}
              // onInput='this.style.height = "";this.style.height = this.scrollHeight + "px"'
              // style={{overflow: 'hidden'}}
              // placeholder="How does the chatbot introduce itself?"
            />
          </div>
          <div className="errors">{errors?.prompt}</div>
          <div className='input-container'>
            <label id={prompt && 'filled'}>Additional Prompt: How should it act?</label>
            <textarea
              value={prompt}
              // onInput='this.style.height = "";this.style.height = this.scrollHeight + "px"'
              onChange={update('prompt')}
              // style={{overflow: 'hidden'}}
              // placeholder="Details about your chatbot so it acts the way you want."
            />
          </div>
          <label>
            <span>Chatbot Image</span>
            <input type="file" accept=".jpg, .jpeg, .png" className='picture-input' onChange={handleFile} />
          </label>
          {photoUrl? <img className='preview' src={photoUrl} alt='preview' /> 
            : form !== 'new' && chatbot?.profileImageUrl ? <img className='preview' src={chatbot?.profileImageUrl} alt='preview' /> 
            : null}
          {image ? <button className='chatbot-img-remove-button' onClick={handleClearFile}>Remove</button>: null}
          <input
            type="submit"
            value={form === 'edit' ? 'Save' : 'Create'}
            disabled={!name || !greeting}
          />
          </form>
          {/* {loadingImage? <div className='loading'>Loading...</div> : null} */}
          {/* {aiProfileImages?.map((image, i) => <img key={i} src={image.url} alt='profile' />)} */}
          {/* <input type='text' value={imagePrompt}
              onChange={update('imagePrompt')}
              placeholder="Image imagePrompt"/> */}
          {/* <button onClick={generateImage} disabled={!imagePrompt || loadingImage} >Generate Profile Picture</button> */}

        </div>
    );
}

export default ChatBotNew;






