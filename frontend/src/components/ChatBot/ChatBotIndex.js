import { useEffect } from "react";
import {useDispatch, useSelector} from "react-redux";
import { fetchChatBots } from "../../store/chatbots";
import {Link , useHistory} from "react-router-dom";
import { createChat } from "../../store/chat";
import { openModal } from "../../store/modal";
import { Swiper, SwiperSlide} from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/bundle'


function ChatBotIndex(){
  const dispatch = useDispatch();
  const history = useHistory();
  const chatBots = useSelector(state => Object.values(state.entities.chatBots.all).length !== 0 ?  Object.values(state.entities.chatBots.all) : []  )
  const chatted = useSelector(state => state.entities.chatBots?.chatted )
  useEffect(()=>{
    dispatch(fetchChatBots())
  }, [dispatch])

  const clickHandler = (chatBotId) => (e)=>{
    dispatch(createChat({chatBotId}));
    history.push(`/chatbots/${chatBotId}`)
  } 

  return(
    <div className="chatbots-index-container">
      <h1>Featured Chatbots</h1>
      <Swiper
       modules={[Navigation, Pagination, Scrollbar]}
       className="swiper"
       spaceBetween={5}
       slidesPerView={0}
       breakpoints={{
        // when window width is >= 320px
        1121: {
          slidesPerView: 8
          // spaceBetween: 5
        },
        1100: {
          slidesPerView: 7
          // spaceBetween: 5
        },
        900: {
          slidesPerView: 6
          // spaceBetween: 10
        },
        400: {
          slidesPerView: 2
          // spaceBetween: 10
        },
      }}
       navigation
      //  pagination={{ clickable: true }}
      //  scrollbar={{ draggable: true }}
       onSlideChange={() => console.log('slide change')}
       onSwiper={(swiper) => console.log(swiper)}
      >
        {chatBots?.map((bot, i)=>{
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
        {/* <SwiperSlide>Slide 1</SwiperSlide>
        <SwiperSlide>Slide 2</SwiperSlide>
        <SwiperSlide>Slide 3</SwiperSlide>
        <SwiperSlide>Slide 4</SwiperSlide> */}
      </Swiper>


      {/* <h1>Featured Chatbots</h1> */}
      <div className="chatbots-index-container">
        {chatBots?.map((bot, i)=>{
          return(
            <ul className="chatbots-index-details" key={i}>
              <li title={bot.name}>{bot.name}</li>
              <img src={bot.profileImageUrl} alt={bot.name}/>
              {chatted.includes(bot._id) ? <Link to={`/chatbots/${bot._id}`} id="resume-button">Resume Chat</Link> : <button onClick={clickHandler(bot._id)} id="chat-button"> Start Chat</button>}
            </ul>
          )
        })}
      </div>
      {/* <h1>Recently Chatted With</h1> */}
    </div>
  )

  
  

}

export default ChatBotIndex;