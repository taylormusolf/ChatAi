import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {createChatBot} from '../../store/chatbots'
import { Link } from 'react-router-dom/cjs/react-router-dom.min';

function ChatBotNew(){
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState(null);
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
      default:
        throw Error('Unknown field in Form');
    }
  
    return e => setState(e.currentTarget.value);
  }

  const updateFile = e => setImage(e.target.files[0]);


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
            <input type="file" accept=".jpg, .jpeg, .png" onChange={updateFile} />
          </label>
          <input
            type="submit"
            value="Create"
            disabled={!name || !location || !bio}
          />
          </form>
          <Link to='/chatbots'>Back to chatbot index</Link>
        </div>
    );
}

export default ChatBotNew;






