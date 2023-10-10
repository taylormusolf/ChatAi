import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserChatBots, deleteChatBot } from '../../store/chatbots';
import { createChat } from "../../store/chat";
import {Link , useHistory} from "react-router-dom";
import { openModal } from '../../store/modal';
import './Profile.css'
import { Swiper, SwiperSlide} from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/bundle'

function Profile () {
  const dispatch = useDispatch();
  const history = useHistory();
  const currentUser = useSelector(state => state.session.user);
  const userChatBots = useSelector(state => state.entities.chatBots.user);
  const chatted = useSelector(state => state.entities.chatBots?.chatted );
  
  useEffect(() => {
    dispatch(fetchUserChatBots(currentUser._id))
  }, [currentUser, dispatch]);

  const clickHandler = (chatBotId) => (e)=>{
    dispatch(createChat({chatBotId}));
    history.push(`/chatbots/${chatBotId}`)
  } 

    return (
      <div className='profile-bots-container'>
        <div className="created-container">
          <h1>Your Created Chatbots</h1>
          {Object.values(userChatBots).length ?
            <Swiper
              modules={[Navigation, Pagination, Scrollbar]}
              className="swiper"
              spaceBetween={15}
              speed={700}
              autoHeight={true}
              centerInsufficientSlides={true}
              slidesPerGroupAuto={true}
              slidesPerView='auto'
              navigation
              scrollbar={{ draggable: true, dragSize: 50, snapOnRelease: true}}
            >
              {Object.values(userChatBots).map((bot, i)=>{
                return(
                  <SwiperSlide key={bot._id}>
                    <ul className="chatbots-index-details" >
                      <li title={bot.name}>{bot.name}</li>
                      <img src={bot.profileImageUrl} alt={bot.name}/>
                      {chatted.includes(bot._id) ? <Link to={`/chatbots/${bot._id}`} id="resume-button">Resume Chat</Link> : <button onClick={clickHandler(bot._id)} id="chat-button"> Start Chat</button>}
                    </ul>
                  </SwiperSlide>
                )
              })}
            </Swiper> : <div className="no-chatbot-message"> No Chatbots Created Yet!</div>
          }
        </div>
      </div>
    );
  }

export default Profile;