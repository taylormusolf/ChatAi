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

  const breakpoints = {
    // when window width is >= 320px
    1121: {
      slidesPerView: 8,
      // spaceBetween: .25,
      slidesPerGroup: 7
    },
    1100: {
      slidesPerView: 7,
      slidesPerGroup: 6
      // spaceBetween: 5
    },
    900: {
      slidesPerView: 6,
      slidesPerGroup: 5
      // spaceBetween: 10
    },
    700: {
      slidesPerView: 5,
      slidesPerGroup: 4
      // spaceBetween: 10
    },
    500: {
      slidesPerView: 4,
      slidesPerGroup: 3
      // spaceBetween: 10
    },
    300: {
      slidesPerView: 3,
      slidesPerGroup: 2
      // spaceBetween: 10
    },
    100: {
      slidesPerView: 2,
      slidesPerGroup: 1
      // spaceBetween: 10
    }
  }

  return(
    <div className="chatbots-index-container">
      <div className="featured-container">
        <h1>Featured Chatbots</h1>
        <Swiper
        modules={[Navigation, Pagination, Scrollbar]}
        className="swiper"
        spaceBetween={15}
        speed={700}
        autoHeight={true}
        centerInsufficientSlides={true}
        breakpoints={breakpoints}
        navigation
        //  pagination={{ clickable: true }}
        scrollbar={{ draggable: true, dragSize: 50, snapOnRelease: true}}
        //  onSlideChange={() => console.log('slide change')}
        //  onSwiper={(swiper) => console.log(swiper)}
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
        </Swiper>
      </div>
      <div className="chatted-container">
        <h1>Recently Chatted Chatbots</h1>
        <Swiper
        modules={[Navigation, Pagination, Scrollbar]}
        className="swiper"
        spaceBetween={15}
        speed={700}
        autoHeight={true}
        centerInsufficientSlides={true}
        breakpoints={breakpoints}
        navigation
        scrollbar={{ draggable: true, dragSize: 50, snapOnRelease: true}}
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
        </Swiper>
      </div>
      <div className="created-container">
        <h1>Created Chatbots</h1>
        <Swiper
        modules={[Navigation, Pagination, Scrollbar]}
        className="swiper"
        spaceBetween={15}
        speed={700}
        autoHeight={true}
        centerInsufficientSlides={true}
        breakpoints={breakpoints}
        navigation
        scrollbar={{ draggable: true, dragSize: 50, snapOnRelease: true}}
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
        </Swiper>
      </div>


    </div>
  )

  
  

}

export default ChatBotIndex;