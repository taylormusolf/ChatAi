import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {createChatBot} from '../../store/chatbots';
import {createChat} from '../../store/chat';
import { closeModal } from '../../store/modal';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

function ChatBotClone(){
  const [name, setName] = useState('');
  const [prompt, setPrompt] = useState('');
  const [from, setFrom] = useState('');
  const [description, setDescription] = useState('');
  const [greeting, setGreeting] = useState('');
  const [image, setImage] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  const errors = useSelector(state => state.errors.session);
  const history = useHistory();
  const dispatch = useDispatch();
  const chatbot = useSelector(state => state.entities.chatBots?.new ? state.entities.chatBots.new : null  )

  useEffect(()=>{
    if(chatbot){
      setName(chatbot.name);
      setPrompt(chatbot.prompt);
      setFrom(chatbot.from);
      setDescription(chatbot.description);
      setGreeting(chatbot.greeting);
    }

  }, [chatbot])


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

  const chatBotSubmitCleanup = (chatbot) => {
    dispatch(createChat({chatBotId: chatbot?._id})).then(history.push(`/chatbots/${chatbot._id}`));
  }


  const chatBotSubmit = e => {
    e.preventDefault();
    let newImage;
    if(image !== null){
      newImage = image;
    }else{
      newImage = chatbot.profileImageUrl
    }
    const bot = {
      _id: chatbot._id,
      name,
      from,
      image: newImage,
      prompt,
      description,
      greeting
    };

    dispatch(createChatBot(bot)).then((chatbot)=> chatBotSubmitCleanup(chatbot));
    dispatch(closeModal());
  }
  

  return (
      <div className="chatbot-form-container">
        <form className="chatbot-form" onSubmit={chatBotSubmit}>
          <h2>Chatbot Clone</h2>
          <div className="errors">{errors?.name}</div>
          <label>
            <span>Name *required*</span>
            <input type="text"
              value={name}
              onChange={update('name')}
              placeholder="What is their name?"
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
            <span>Greeting *required*</span>
            <input type="greeting"
              value={greeting}
              onChange={update('greeting')}
              placeholder="How does the chatbot introduce itself?"
            />
          </label>
          <div className="errors">{errors?.prompt}</div>
          <label>
            <span>Prompt</span>
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
            disabled={!name || !from || !prompt}
          />
          </form>
          {photoUrl ? <img className='preview' src={photoUrl} alt='preview' /> : chatbot?.profileImageUrl ? <img className='preview' src={chatbot.profileImageUrl} alt='preview' /> : null}
        </div>
    );
}

export default ChatBotClone;