import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {createChatBot, fetchChatBot, updateChatBot} from '../../store/chatbots';
import { closeModal } from '../../store/modal';
import { Link, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import './ChatBotNew.css'

function ChatBotEdit(){
  // const {chatbotId} = useParams();
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  const errors = useSelector(state => state.errors.session);
  const dispatch = useDispatch();
  const chatbot = useSelector(state => state.entities.chatBots?.new ? state.entities.chatBots.new : null  )


  // useEffect(()=>{
  //   dispatch(fetchChatBot(chatbotId))
  // }, [chatbotId, dispatch])

  useEffect(()=>{
    if(chatbot){
      setName(chatbot.name);
      setBio(chatbot.bio);
      setLocation(chatbot.location);
    }

  }, [chatbot])


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
      default:
        throw Error('Unknown field in Form');
    }
  
    return e => setState(e.currentTarget.value);
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
      _id: chatbot._id,
      name,
      location,
      image,
      bio
    };
  
    dispatch(updateChatBot(bot)); 
    dispatch(closeModal());
  }
  

  return (
      <div className="chatbot-form-container">
        <form className="chatbot-form" onSubmit={chatBotSubmit}>
          <h2>Chatbot Edit Form</h2>
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
            <span>Location</span>
            <input type="location"
              value={location}
              onChange={update('location')}
              placeholder="location"
            />
          </label>
          <div className="errors">{errors?.bio}</div>
          <label>
            <span>Bio</span>
            <textarea type="bio"
              value={bio}
              onChange={update('bio')}
              placeholder="Bio"
            />
          </label>
          <label>
            Chatbot Image
            <input type="file" accept=".jpg, .jpeg, .png" onChange={handleFile} />
          </label>
          <input
            type="submit"
            value="Save"
            disabled={!name || !location || !bio}
          />
          </form>
          {photoUrl ? <img className='preview' src={photoUrl} alt='preview' /> : chatbot?.profileImageUrl ? <img className='preview' src={chatbot.profileImageUrl} alt='preview' /> : null}
          <Link to='/chatbots'>Back to chatbot index</Link>
        </div>
    );
}

export default ChatBotEdit;
